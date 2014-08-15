using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace DesktopBrowser.Server.Utils
{
    public class PathInfo
    {
        public string Value { get; private set; }

        public PathInfo(string path)
        {
            Value = path;
        }

        public bool IsRoot
        {
            get
            {
                if (IsEmpty)
                    return false;
                var abs = ToAbsolute();
                return System.IO.Path.GetPathRoot(abs.Value) == abs.Value;
            }
        }
        public bool IsEmpty
        {
            get
            {
                return Value.IsNullOrEmpty();
            }
        }
        public PathInfo Combine(string path)
        {
            if (IsEmpty)
                return new PathInfo(path);
            return new PathInfo(System.IO.Path.Combine(this.Value, path));
        }
        public PathInfo Combine(PathInfo path)
        {
            return Combine(path.Value);
        }

        public PathInfo ToAbsolute()
        {
            if (IsEmpty)
                return this;
            if (System.IO.Path.IsPathRooted(Value))
                return this;
            return new PathInfo(System.IO.Path.GetFullPath(Value));
        }
        public PathInfo ToAbsoluteExact()
        {
            if (IsEmpty)
                return this;
            return new PathInfo(new DirectoryInfo(Value).FullName);
        }

        public override string ToString()
        {
            return Value;
        }

        public bool IsFile
        {
            get { return System.IO.File.Exists(Value); }
        }
        public bool IsDirectory
        {
            get { return System.IO.Directory.Exists(Value); }
        }
        public PathInfo ParentPath
        {
            get
            {
                if (IsEmpty)
                    return this;
                if (IsRoot)
                    return new PathInfo("");
                return new PathInfo(System.IO.Path.GetDirectoryName(Value));
            }
        }

        public string Name
        {
            get
            {
                if (IsRoot)
                    return Value;
                return System.IO.Path.GetFileName(Value);
            }
        }


        public string Extension
        {
            get { return System.IO.Path.GetExtension(Value); }
        }
    }
}