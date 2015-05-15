using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SharpKit.JavaScript;
using DesktopBrowser.Server.Utils;

namespace DesktopBrowser.Server
{
    [JsType(JsMode.Json)]
    public class File
    {
        public bool IsFolder { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Modified { get; set; }
        public bool IsHidden { get; set; }
        public double? Size { get; set; }

        public string Extension { get; set; }
    }

    public class FileRelativesInfo
    {
        public File ParentFolder { get; set; }
        public File NextSibling { get; set; }
        public File PreviousSibling { get; set; }
    }
}