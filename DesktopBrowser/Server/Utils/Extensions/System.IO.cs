using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DesktopBrowser.Server.Utils;

namespace System.IO
{


	internal static class Extensions
	{
        public static IEnumerable<T> ToCachedEnumerable<T>(this IEnumerable<T> list)
        {
            return new CachedEnumerable<T>(list);
        }
        public static IEnumerable<FileSystemInfo> EnumerateFileSystemElementsRecursive(this DirectoryInfo dir)
        {
            var stack = new Stack<DirectoryInfo>();
            stack.Push(dir);
            while (stack.Count > 0)
            {
                var dir2 = stack.Pop();
                foreach (var file in dir2.EnumerateFileSystemInfos())
                {
                    yield return file;
                    if (file is DirectoryInfo)
                    {
                        var dir3 = (DirectoryInfo)file;
                        stack.Push(dir3);
                    }
                }
            }
        }
        public static IEnumerable<FileSystemInfo> EnumerateFilesRecursive(this DirectoryInfo dir)
        {
            var stack = new Queue<DirectoryInfo>();
            stack.Enqueue(dir);
            while (stack.Count > 0)
            {
                var dir2 = stack.Dequeue();
                foreach (var file in dir2.EnumerateFileSystemInfos())
                {
                    if (file is DirectoryInfo)
                    {
                        var dir3 = (DirectoryInfo)dir;
                        stack.Enqueue(dir3);
                    }
                    else
                    {
                        yield return (FileSystemInfo)file;
                    }
                }
            }
        }
        ////
        //// Summary:
        ////     Returns an enumerable collection of directory information in the current
        ////     directory.
        ////
        //// Returns:
        ////     An enumerable collection of directories in the current directory.
        ////
        //// Exceptions:
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.DirectoryInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<DirectoryInfo> EnumerateDirectoriesCached(this DirectoryInfo dir)
        //{
        //    return dir.EnumerateDirectories().ToCachedEnumerable();
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of directory information that matches a
        ////     specified search pattern.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all directories.
        ////
        //// Returns:
        ////     An enumerable collection of directories that matches searchPattern.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.DirectoryInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<DirectoryInfo> EnumerateDirectoriesCached(this DirectoryInfo dir, string searchPattern)
        //{
        //    return new CachedEnumerable<DirectoryInfo>(dir.EnumerateDirectories(searchPattern));
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of directory information that matches a
        ////     specified search pattern and search subdirectory option.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all directories.
        ////
        ////   searchOption:
        ////     One of the enumeration values that specifies whether the search operation
        ////     should include only the current directory or all subdirectories. The default
        ////     value is System.IO.SearchOption.TopDirectoryOnly.
        ////
        //// Returns:
        ////     An enumerable collection of directories that matches searchPattern and searchOption.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.ArgumentOutOfRangeException:
        ////     searchOption is not a valid System.IO.SearchOption value.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.DirectoryInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<DirectoryInfo> EnumerateDirectoriesCached(this DirectoryInfo dir, string searchPattern, SearchOption searchOption)
        //{
        //    return new CachedEnumerable<DirectoryInfo>(dir.EnumerateDirectories(searchPattern, searchOption));
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file information in the current directory.
        ////
        //// Returns:
        ////     An enumerable collection of the files in the current directory.
        ////
        //// Exceptions:
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileInfo object is invalid (for example,
        ////     it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileInfo> EnumerateFilesCached(this DirectoryInfo dir)
        //{
        //    return new CachedEnumerable<FileInfo>(dir.EnumerateFiles());
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file information that matches a search
        ////     pattern.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all files.
        ////
        //// Returns:
        ////     An enumerable collection of files that matches searchPattern.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileInfo object is invalid, (for example,
        ////     it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileInfo> EnumerateFilesCached(this DirectoryInfo dir, string searchPattern)
        //{
        //    return new CachedEnumerable<FileInfo>(dir.EnumerateFiles(searchPattern));
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file information that matches a specified
        ////     search pattern and search subdirectory option.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all files.
        ////
        ////   searchOption:
        ////     One of the enumeration values that specifies whether the search operation
        ////     should include only the current directory or all subdirectories. The default
        ////     value is System.IO.SearchOption.TopDirectoryOnly.
        ////
        //// Returns:
        ////     An enumerable collection of files that matches searchPattern and searchOption.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.ArgumentOutOfRangeException:
        ////     searchOption is not a valid System.IO.SearchOption value.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileInfo object is invalid (for example,
        ////     it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileInfo> EnumerateFilesCached(this DirectoryInfo dir, string searchPattern, SearchOption searchOption)
        //{
        //    return new CachedEnumerable<FileInfo>(dir.EnumerateFiles(searchPattern, searchOption));
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file system information in the current
        ////     directory.
        ////
        //// Returns:
        ////     An enumerable collection of file system information in the current directory.
        ////
        //// Exceptions:
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileSystemInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileSystemInfo> EnumerateFileSystemInfosCached(this DirectoryInfo dir)
        //{
        //    return new CachedEnumerable<FileSystemInfo>(dir.EnumerateFileSystemInfos());
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file system information that matches
        ////     a specified search pattern.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all files and
        ////     directories.
        ////
        //// Returns:
        ////     An enumerable collection of file system information objects that matches
        ////     searchPattern.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileSystemInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileSystemInfo> EnumerateFileSystemInfosCached(this DirectoryInfo dir, string searchPattern)
        //{
        //    return new CachedEnumerable<FileSystemInfo>(dir.EnumerateFileSystemInfos(searchPattern));
        //}
        ////
        //// Summary:
        ////     Returns an enumerable collection of file system information that matches
        ////     a specified search pattern and search subdirectory option.
        ////
        //// Parameters:
        ////   searchPattern:
        ////     The search string. The default pattern is "*", which returns all files or
        ////     directories.
        ////
        ////   searchOption:
        ////     One of the enumeration values that specifies whether the search operation
        ////     should include only the current directory or all subdirectories. The default
        ////     value is System.IO.SearchOption.TopDirectoryOnly.
        ////
        //// Returns:
        ////     An enumerable collection of file system information objects that matches
        ////     searchPattern and searchOption.
        ////
        //// Exceptions:
        ////   System.ArgumentNullException:
        ////     searchPattern is null.
        ////
        ////   System.ArgumentOutOfRangeException:
        ////     searchOption is not a valid System.IO.SearchOption value.
        ////
        ////   System.IO.DirectoryNotFoundException:
        ////     The path encapsulated in the System.IO.FileSystemInfo object is invalid (for
        ////     example, it is on an unmapped drive).
        ////
        ////   System.Security.SecurityException:
        ////     The caller does not have the required permission.
        //public static IEnumerable<FileSystemInfo> EnumerateFileSystemInfosCached(this DirectoryInfo dir, string searchPattern, SearchOption searchOption)
        //{
        //    return new CachedEnumerable<FileSystemInfo>(dir.EnumerateFileSystemInfos(searchPattern, searchOption));
        //}

		public static DirectoryInfo GetParent(this FileSystemInfo element)
		{
			if (element is FileInfo)
				return ((FileInfo)element).Directory;
			return ((DirectoryInfo)element).Parent;
		}

		public static string GetNameWithoutExtension(this FileInfo file)
		{
			return Path.GetFileNameWithoutExtension(file.Name);
		}
		public static DirectoryInfo GetExistingDirectory(this DirectoryInfo dir, string name)
		{
			var dir2 = new DirectoryInfo(dir.FullName + "\\" + name);
			if (dir2.Exists)
				return dir2;
			return null;
		}
		public static DirectoryInfo GetDirectory(this DirectoryInfo dir, string name)
		{
			return new DirectoryInfo(dir.FullName + "\\" + name);
		}
		public static DirectoryInfo GetCreateDirectory(this DirectoryInfo dir, string name)
		{
			var sub = dir.GetDirectory(name);
			if (!sub.Exists)
				sub.Create();
			return sub;
		}

		public static FileInfo GetFile(this DirectoryInfo dir, string name)
		{
			return new FileInfo(dir.FullName + "\\" + name);
		}

		public static void CopyToDirectory(this FileInfo file, string dir)
		{
			var di = new DirectoryInfo(dir);
			file.CopyTo(di.GetFile(file.Name).FullName);
		}

		public static FileInfo CopyToDirectory(this FileInfo file, DirectoryInfo dir)
		{
			return CopyToDirectory(file, dir, false);
		}
		public static FileInfo CopyToDirectory(this FileInfo file, DirectoryInfo dir, bool overwrite)
		{
			var newFile = dir.GetFile(file.Name);
			file.CopyTo(newFile.FullName, overwrite);
			return newFile;
		}

		//public static void Copy(this DirectoryInfo dir, string source, string destination)
		//{
		//  var files = dir.GetFiles(source);
		//  var destDir = new DirectoryInfo(destination);
		//  foreach (var file in files)
		//  {
		//    file.CopyToDirectory(destDir);
		//  }
		//}

		static Stack<DirectoryInfo> GetPath(this DirectoryInfo dir)
		{
			var dirPath = new Stack<DirectoryInfo>();
			while (dir != null)
			{
				dirPath.Push(dir);
				dir = dir.Parent;
			}
			return dirPath;
		}

		public static string CreateRelativePathTo(this DirectoryInfo dir, FileSystemInfo file)
		{
			if (dir.FullName.EqualsIgnoreCase(file.FullName))
				return ".";
			if (file.FullName.StartsWith(dir.FullName, StringComparison.InvariantCultureIgnoreCase))
			{
				return file.FullName.ReplaceFirst(dir.FullName + "\\", "", StringComparison.InvariantCultureIgnoreCase);
			}
			else
			{
				DirectoryInfo dir2 = file as DirectoryInfo;
				if (dir2 == null)
					dir2 = ((FileInfo)file).Directory;
				var dirPath = dir.GetPath();
				var dir2Path = dir2.GetPath();
				while (dirPath.Peek() == dir2Path.Peek())
				{
					dirPath.Pop();
					dir2Path.Pop();
				}
				var final = dirPath.Peek().FullName;
				foreach (var p in dirPath)
				{
					final = Path.Combine(final, "..");
				}
				foreach (var p in dir2Path)
				{
					final = Path.Combine(final, p.Name);
				}
				if (file is FileInfo)
					final = Path.Combine(final, ((FileInfo)file).Name);
				return final;
			}
		}

		public static void Copy(this DirectoryInfo dir, string searchPattern, SearchOption searchOption, DirectoryInfo targetDir, bool overwrite)
		{
			if (overwrite)
				Transform(dir, searchPattern, searchOption, targetDir, CopyWithOverwriteTransformer);
			else
				Transform(dir, searchPattern, searchOption, targetDir, CopyTransformer);
		}

		static void CopyWithOverwriteTransformer(FileInfo source, FileInfo target)
		{
			source.CopyTo(target.FullName, true);
		}
		static void CopyTransformer(FileInfo source, FileInfo target)
		{
			source.CopyTo(target.FullName);
		}

		[Obsolete("Use the other one instead")]
		public static void Transform(
			this DirectoryInfo dir, string searchPattern, SearchOption searchOption,
			DirectoryInfo targetDir,
			Action<FileInfo, FileInfo, Dictionary<string, string>> transformer, Dictionary<string, string> args)
		{
			var files = dir.GetFiles(searchPattern, searchOption);
			foreach (var file in files)
			{
				if (file.FullName.Contains("\\.svn\\"))
					continue;
				var relFile = dir.CreateRelativePathTo(file);
				var finalTargetFile = targetDir.GetFile(relFile);
				transformer(file, finalTargetFile, args);
			}
		}

		public static void Transform(this DirectoryInfo dir, string searchPattern, SearchOption searchOption, DirectoryInfo targetDir, Action<FileInfo, FileInfo> transformer)
		{
			var files = dir.GetFiles(searchPattern, searchOption);
			foreach (var file in files)
			{
				var relFile = dir.CreateRelativePathTo(file);
				var finalTargetFile = targetDir.GetFile(relFile);
				transformer(file, finalTargetFile);
			}
		}


		public static bool IsHidden(this FileInfo file)
		{
			return file.Attributes.HasFlag(FileAttributes.Hidden);
		}
        //public static void SetHidden(this FileInfo file, bool hidden)
        //{
        //    file.Attributes = FlagsHelper.SetOnOrOff(file.Attributes, FileAttributes.Hidden, hidden);
        //}


	}
}
