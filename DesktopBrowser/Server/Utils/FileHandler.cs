using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Microsoft.Win32;
using System.Security.Permissions;
using System.Diagnostics;
using System.Web.Caching;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using Kaliko.ImageLibrary;

namespace DesktopBrowser.Server.Utils
{
    static class Extensions
    {
        public static System.Drawing.Size ResizeToWidth(this System.Drawing.Size size, int newWidth)
        {
            var factor = ((double)newWidth) / ((double)size.Width);
            var newHeight = (int)(size.Height * factor);
            return new System.Drawing.Size(newWidth, newHeight);
        }
    }
    public class FileHandler : IHttpHandler
    {
        /// <summary>
        /// create an image object, using the filename we just retrieved
        ///var image = Image.FromFile(file);
        ///var newSize = image.Size.ResizeToWidth(256);
        /// create the actual thumbnail image
        ///var thumbnailImage = image.GetThumbnailImage(newSize.Width, newSize.Height, () => true, IntPtr.Zero);
        /// make a memory stream to work with the image bytes
        /// put the image into the memory stream
        ///    thumbnailImage.Save(imageStream, ImageFormat.Jpeg);
        ///     make byte array the same size as the image
        ///   rewind the memory stream
        ///      load the byte array with the image
        /// </summary>
        /// <param name="context"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        bool TrySendThumbnail(HttpContext context, string file)
        {
            if (context.Response.ContentType != "image/jpeg")
                return false;
            try
            {
                using (var image = new KalikoImage(file))
                {
                    using (var thumbnailImage = image.GetThumbnailImage(256, 256))
                    {
                        using (var imageStream = new MemoryStream())
                        {
                            thumbnailImage.SaveJpg(imageStream, 90);
                            var imageContent = new byte[imageStream.Length];
                            imageStream.Position = 0;
                            imageStream.Read(imageContent, 0, (int)imageStream.Length);
                            context.Response.BinaryWrite(imageContent);
                            return true;
                        }
                    }
                }
            }
            catch
            {
                return false;
            }

        }
        public void ProcessRequest(HttpContext context)
        {
            var file = context.Request.QueryString["p"];
            if (System.IO.File.Exists(file))
            {
                context.Response.ContentType = GetMIMEType(file);
                context.Response.BufferOutput = false;

                var refresh = TimeSpan.FromHours(1);
                context.Response.Cache.VaryByParams["*"] = true;
                context.Response.Cache.SetExpires(DateTime.Now.Add(refresh));
                context.Response.Cache.SetMaxAge(refresh);
                context.Response.Cache.SetCacheability(HttpCacheability.Server);
                context.Response.Cache.SetValidUntilExpires(true);
                if (!TrySendThumbnail(context, file))
                    context.Response.WriteFile(file);
            }
            else
            {
                throw new HttpException(404, "File not found");
            }
        }

        public string GetMIMEType(string filepath)
        {
            var fileInfo = new FileInfo(filepath);
            var fileExtension = fileInfo.Extension.ToLower();
            return CacheMethod(String.Format("GetMIMEType({0})", filepath), 1000000, 0, () => GetMimeTypeFromRegistry(fileExtension));
        }
        //List<MimeTypeInfo> GetMimeTypesNoCache()
        //{
        //    using (ServerManager serverManager = new ServerManager())
        //    {
        //        var config = serverManager.GetWebConfiguration("Default Web Site");
        //        var staticContentSection = config.GetSection("system.webServer/staticContent");
        //        var staticContentCollection = staticContentSection.GetCollection();
        //        var mimeTypes = staticContentSection.GetCollection().Select(t => new MimeTypeInfo{ FileExtension = t["fileExtension"] as string, MimeType = t["mimeType"] as string }).ToList();
        //        return mimeTypes;
        //    }
        //}
        //static List<MimeTypeInfo> MimeTypes;
        //public string GetMimeTypeNoCache(string fileExtension)
        //{
        //    if (MimeTypes == null)
        //        MimeTypes = GetMimeTypesNoCache();
        //    var mt =  MimeTypes.Where(t => t.FileExtension.EqualsIgnoreCase(fileExtension)).FirstOrDefault();
        //    if (mt != null)
        //        return mt.MimeType;
        //    return null;

        //}
        public string GetMimeTypeFromRegistry(string fileExtension)
        {
            // direct mapping which is fast and ensures these extensions are found
            switch (fileExtension)
            {
                case ".htm":
                case ".html":
                    return "text/html";
                case ".js":
                    return "text/javascript"; // registry may return "application/x-javascript"
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
            }

            // If that failed...
            // looks for a content type with extension
            RegistryKey typeKey = Registry.ClassesRoot.OpenSubKey(@"MIME\Database\Content Type");

            foreach (string keyname in typeKey.GetSubKeyNames())
            {
                RegistryKey curKey = typeKey.OpenSubKey(keyname);
                if (curKey != null)
                {
                    object extension = curKey.GetValue("Extension");
                    if (extension != null)
                    {
                        if (extension.ToString().ToLower() == fileExtension)
                        {
                            return keyname;
                        }
                    }
                }
            }

            // If that failed...
            // see if we can find extension info anywhere in the registry
            RegistryPermission regPerm = new RegistryPermission(RegistryPermissionAccess.Read, @"\\HKEY_CLASSES_ROOT");

            // looks for extension with a content type
            RegistryKey rkContentTypes = Registry.ClassesRoot.OpenSubKey(fileExtension);
            if (rkContentTypes != null)
            {
                object key = rkContentTypes.GetValue("Content Type");
                if (key != null)
                    return key.ToString().ToLower();
            }

            return null;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }


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

    }

    class MimeTypeInfo
    {
        public string FileExtension { get; set; }
        public string MimeType { get; set; }
    }
}