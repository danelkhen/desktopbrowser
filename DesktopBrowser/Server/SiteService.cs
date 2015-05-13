using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DesktopBrowser.Server.Utils;
using System.IO;
using SharpKit.JavaScript;
using System.Diagnostics;
using System.Web.Caching;
using System.Runtime.Serialization;
using System.Runtime.InteropServices;
using System.Threading;
using System.Configuration;

namespace DesktopBrowser.Server
{


    [DataService]
    public class SiteService
    {
        public ListFilesResponse ListFiles(ListFilesRequest req)
        {
            var res = new ListFilesResponse
            {
                Relatives = GetFileRelatives(req.Path),
                File = GetFile(new PathRequest { Path = req.Path }),
            };
            if (res.File.IsFolder)
            {
                res.Files = GetFiles(req).ToList();
            }
            return res;
        }

        public virtual IEnumerable<File> GetFiles(SiteRequest req)
        {
            if (req.HideFiles && req.HideFolders)
                return Enumerable.Empty<File>();
            else if (!req.MixFilesAndFolders && !req.HideFiles && !req.HideFolders && !req.IsRecursive)
            {
                var folders = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, false, true);
                var files = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, true, false);
                folders = ApplyRequest(folders, req);
                files = ApplyRequest(files, req);
                var all = folders.Concat(files);
                all = ApplyPaging(all, req);
                all = ApplyCaching(all);
                return all;
            }
            else
            {
                var files = GetFileAndOrFolders(req.Path, req.SearchPattern, req.IsRecursive, !req.HideFiles, !req.HideFolders);
                files = ApplyRequest(files, req);
                files = ApplyPaging(files, req);
                files = ApplyCaching(files);
                return files;
            }
        }

        private IEnumerable<File> ApplyCaching(IEnumerable<File> files)
        {
            return new CachedEnumerable<File>(files);
        }

        private IEnumerable<File> ApplyPaging(IEnumerable<File> files, SiteRequest req)
        {
            if (req.Skip != null)
                files = files.Skip(req.Skip.Value);
            if (req.Take != null)
                files = files.Take(req.Take.Value + 1);
            return files;
        }

        public virtual FileRelativesInfo GetFileRelatives(string path)
        {
            if (path.IsNullOrEmpty())
                return new FileRelativesInfo();
            var pathInfo = new PathInfo(path);
            var info = new FileRelativesInfo();
            info.ParentFolder = GetFile(new PathRequest { Path = pathInfo.ParentPath.Value });
            var parentFiles = GetFileAndOrFolders(info.ParentFolder.Path, null, false, false, true).Where(t => t.IsFolder).OrderBy(t => t.Name).ToList();
            var index = parentFiles.FindIndex(t => t.Name.EqualsIgnoreCase(pathInfo.Name));
            info.NextSibling = index >= 0 && index + 1 < parentFiles.Count ? parentFiles[index + 1] : null;
            info.PreviousSibling = index > 0 ? parentFiles[index - 1] : null;
            return info;
        }

        public virtual File GetFile(PathRequest req)
        {
            var path = req.Path;
            if (path.IsNullOrEmpty())
                return new File { IsFolder = true, Path = "", Name = "Home" };
            var absPath = new PathInfo(path).ToAbsolute();
            if (absPath.IsFile)
            {
                return ToFile(new FileInfo(absPath.Value));
            }
            else if (absPath.IsDirectory)
            {
                return ToFile(new DirectoryInfo(absPath.Value));
            }
            return null;
        }

        public virtual void Execute(PathRequest req)
        {
            var filename = req.Path;
            var process = Process.Start(new ProcessStartInfo
            {
                FileName = filename,
            });
            if (process != null)
                SetForegroundWindow(process.MainWindowHandle);
        }

        public void Delete(PathRequest req)
        {
            var path = req.Path;
            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
            else if (Directory.Exists(path))
            {
                if (path.Split('\\').Length <= 2)
                    throw new Exception("Delete protection, cannot delete path so short, should be at least depth of 3 levels or more");
                Directory.Delete(path, true);
            }
        }


        #region Utils

        IEnumerable<File> ApplyRequest(IEnumerable<File> files, SiteRequest req)
        {
            var calculatedFolderSize = false;
            if (!req.ShowHiddenFiles)
                files = files.Where(t => !t.IsHidden);
            if (req.HideFolders)
                files = files.Where(t => !t.IsFolder);
            if (req.HideFiles)
                files = files.Where(t => t.IsFolder);
            if (req.Sort != null && req.Sort.Columns != null)
            {
                req.Sort.Columns.ForEach(t =>
                {
                    if (t.Name == "Name")
                        files = OrderBy(files, x => x.Name, t.Descending);
                    else if (t.Name == "Modified")
                        files = OrderBy(files, x => x.Modified, t.Descending);
                    else if (t.Name == "Extension")
                        files = OrderBy(files, x => x.Extension, t.Descending);
                    else if (t.Name == "Size")
                    {
                        if (req.FolderSize && !req.HideFolders)
                        {
                            files = CalculateFoldersSize(files);
                            calculatedFolderSize = true;
                        }
                        files = OrderBy(files, x => x.Size, t.Descending);
                    }
                    if (t.Descending)
                        files.Reverse();
                });
            }
            if (!calculatedFolderSize && req.FolderSize && !req.HideFolders)
                files = CalculateFoldersSize(files);
            return files;

        }

        IEnumerable<File> GetFileAndOrFolders(string path, string searchPattern, bool recursive, bool files, bool folders)
        {
            var isFiltered = false;
            IEnumerable<File> files2;
            if (path.IsNullOrEmpty())
                files2 = GetHomeFiles();
            else if (!files && !folders)
                files2 = new File[0];
            //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
            //if (searchPattern.IsNullOrEmpty())
            //    searchPattern = "*";
            else if (recursive)
            {
                var dir = new DirectoryInfo(path);
                files2 = dir.EnumerateFileSystemElementsRecursive().ToCachedEnumerable().Select(ToFile);
            }
            else
            {
                var dir = new DirectoryInfo(path);
                if (files && !folders)
                    files2 = dir.EnumerateFiles().ToCachedEnumerable().Select(ToFile);
                else if (folders && !files)
                    files2 = dir.EnumerateDirectories().ToCachedEnumerable().Select(ToFile);
                else if (folders && files)
                    files2 = dir.EnumerateFileSystemInfos().ToCachedEnumerable().Select(ToFile);
                else
                    throw new Exception();
                isFiltered = true;
            }
            if (!isFiltered)
            {
                if (!files)
                    files2 = files2.Where(t => t.IsFolder);
                else if (!folders)
                    files2 = files2.Where(t => !t.IsFolder);
            }
            return files2;
        }

        //IEnumerable<File> GetFiles(string path)
        //{
        //    if (path.IsNullOrEmpty())
        //        return GetHomeFiles().Where(t => !t.IsFolder);
        //    return new DirectoryInfo(path).EnumerateFilesCached().Select(ToFile);
        //}

        //IEnumerable<File> GetFolders(string path)
        //{
        //    if (path.IsNullOrEmpty())
        //        return GetHomeFiles().Where(t => t.IsFolder);
        //    return new DirectoryInfo(path).EnumerateDirectoriesCached().Select(ToFile);
        //}

        //IEnumerable<File> GetFilesAndFolders(string path)
        //{
        //    if (path.IsNullOrEmpty())
        //        return GetHomeFiles();
        //    return new DirectoryInfo(path).EnumerateFileSystemInfosCached().Select(ToFile);
        //}

        //List<File> GetFiles(string path, bool cache = true)
        //{
        //    return CacheMethod(String.Format("GetFiles({0})", path), cache ? 10 : 0, 100, () => GetFilesNoCache(path));
        //}

        //List<File> GetFilesNoCache(string path)
        //{
        //    if (path.IsNullOrEmpty())
        //    {
        //        var config = GetConfig();
        //        if (config != null && config.HomePage != null)
        //            return config.HomePage.Files;
        //        return DriveInfo.GetDrives().Select(t => new File { IsFolder = true, Name = t.Name, Path = t.Name }).ToList();
        //    }
        //    var files = new DirectoryInfo(path).GetFileSystemInfos().Select(ToFile).ToList();
        //    return files;
        //}

        IEnumerable<File> GetHomeFiles()
        {
            var config = GetConfig();
            if (config != null && config.HomePage != null)
                return config.HomePage.Files;
            return DriveInfo.GetDrives().Select(t => new File { IsFolder = true, Name = t.Name, Path = t.Name, Size = t.IsReady ? t.AvailableFreeSpace : default(double?) }).ToList();
        }

        IEnumerable<File> CalculateFoldersSize(IEnumerable<File> folders)
        {
            foreach (var file in folders)
            {
                try
                {
                    if (file.IsFolder)
                        file.Size = CalculateFolderSize(file.Path);
                }
                catch
                {
                }
                yield return file;
            }
        }

        static IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(IEnumerable<TSource> source, Func<TSource, TKey> keySelector, bool desc)
        {
            var source2 = source as IOrderedEnumerable<TSource>;
            if (source2 != null)
            {
                if (desc)
                    return source2.ThenByDescending(keySelector);
                return source2.ThenBy(keySelector);
            }
            else
            {
                if (desc)
                    return source.OrderByDescending(keySelector);
                return source.OrderBy(keySelector);
            }
        }

        double CalculateFolderSize(string path)
        {
            return CacheMethod(String.Format("CalculateFolderSize({0})", path), 100, 100, () => CalculateFolderSizeNoCache(path));
        }

        double CalculateFolderSizeNoCache(string path)
        {
            var size = 0d;
            try
            {
                var list = new DirectoryInfo(path).GetFileSystemInfos();
                foreach (var item in list)
                {
                    if (item is FileInfo)
                        size += ((FileInfo)item).Length;
                    else
                        size += CalculateFolderSize(item.FullName);

                }
            }
            catch
            {
            }
            return size;
        }

        SiteConfiguration GetConfig()
        {
            return CacheMethod("GetConfig()", 10, 0, GetConfigNoCache);
        }

        SiteConfiguration GetConfigNoCache()
        {
            return SiteConfiguration.Load();
        }

        File ToFile(FileSystemInfo t)
        {
            var file = t as FileInfo;
            var file2 = new File
            {
                Name = t.Name,
                IsFolder = t is DirectoryInfo,
                Modified = t.LastWriteTime,
                Size = file != null ? file.Length : default(double?),
                IsHidden = t.Attributes.HasFlag(FileAttributes.Hidden),
                Extension = file != null ? t.Extension : null,
            };
            try
            {
                file2.Path = t.FullName;
            }
            catch
            {
            }
            return file2;
        }

        void AddToHome(File file)
        {
            var config = SiteConfiguration.Load();
            if (config.HomePage == null)
                config.HomePage = new Page();
            var file2 = config.HomePage.Files.Where(t => t.Name.EqualsIgnoreCase(file.Name)).FirstOrDefault();
            if (file2 != null)
                config.HomePage.Files.Remove(file2);
            config.HomePage.Files.Add(file);
            config.Save();
        }


        [DllImport("user32.dll")]
        static extern bool SetForegroundWindow(IntPtr hWnd);

        /// <summary>
        /// Executes the specified Func[R] with cache
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <param name="cacheKey"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        R CacheMethod<R>(string cacheKey, int expirationInSeconds, int methodMinTimeInMs, Func<R> method)
        {
            if (expirationInSeconds <= 0)
                return method();
            var context = HttpContext.Current;
            if (context == null || context.Cache == null)
                return method();
            var cache = context.Cache;
            var cacheValue = cache[cacheKey];
            if (cacheValue != null)
            {
                if (cacheValue is DBNull)
                    return default(R);
                return (R)cacheValue;
            }
            var stopper = new Stopwatch();
            stopper.Start();
            var x = method();
            stopper.Stop();
            if (methodMinTimeInMs <= 0 || stopper.ElapsedMilliseconds > methodMinTimeInMs)
            {
                if (x == null)
                    cacheValue = DBNull.Value;
                else
                    cacheValue = x;
                cache.Insert(cacheKey, cacheValue, null, DateTime.Now.AddSeconds(expirationInSeconds), Cache.NoSlidingExpiration);
            }
            return x;
        }

        #endregion

    }


    public class DemoSiteService : SiteService
    {
        public DemoSiteService()
        {
            RootPath = ConfigurationManager.AppSettings["DemoSiteRootPath"] ?? "C:\\DesktopBrowserDemoSite";
        }
        public string RootPath { get; set; }

        string MakePathValid(string path)
        {
            var p = new PathInfo(path).ToAbsolute();
            if (p.Value.StartsWith(RootPath, StringComparison.InvariantCultureIgnoreCase))
                return p.Value;
            return RootPath;
        }
        public override IEnumerable<File> GetFiles(SiteRequest req)
        {
            req.Path = MakePathValid(req.Path);
            return base.GetFiles(req);
        }

        public override FileRelativesInfo GetFileRelatives(string path)
        {
            path = MakePathValid(path);
            return base.GetFileRelatives(path);
        }

        public override File GetFile(PathRequest req)
        {
            req.Path = MakePathValid(req.Path);
            return base.GetFile(req);
        }

        public override void Execute(PathRequest req)
        {
            return;
        }
    }
}

//interface ISiteService
//{
//    void Execute(string filename);
//    File GetFile(string path);
//    FileRelativesInfo GetFileRelatives(string path);
//    IEnumerable<File> GetFiles(SiteRequest req);
//}
//[DataService]
//public class SiteService //: ISiteService
//{
//    public SiteService()
//    {
//        if (ConfigurationManager.AppSettings["IsDemo"] == "true")
//            Service = new DemoSiteService();
//        else
//            Service = new RealSiteService();
//    }
//    ISiteService Service;
//    public IEnumerable<File> GetFiles(SiteRequest req)
//    {
//        return Service.GetFiles(req);
//    }

//    public FileRelativesInfo GetFileRelatives(string path)
//    {
//        return Service.GetFileRelatives(path);
//    }

//    public File GetFile(string path)
//    {
//        return Service.GetFile(path);
//    }

//    public void Execute(string filename)
//    {
//        Service.Execute(filename);
//    }

//    public void Delete(string path)
//    {
//        if (System.IO.File.Exists(path))
//            System.IO.File.Delete(path);
//        else if (Directory.Exists(path))
//        {
//            if (path.Split('\\').Length <= 2)
//                throw new Exception("Delete protection, cannot delete path so short, should be at least depth of 3 levels or more");
//            Directory.Delete(path, true);
//        }
//    }

//}
