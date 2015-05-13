using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using SharpKit.Utils;
using SharpKit.JavaScript;

namespace DesktopBrowser.Server
{

    [JsType(JsMode.Json)]
    public class SiteRequest
    {
        public string SearchPattern { get; set; }
        public bool IsRecursive { get; set; }
        public bool FolderSize { get; set; }
        public bool HideFolders { get; set; }
        public bool HideFiles { get; set; }
        public string Path { get; set; }
        public SortRequest Sort { get; set; }
        public bool MixFilesAndFolders { get; set; }
        public bool ShowHiddenFiles { get; set; }
        public bool NoCache { get; set; }
        public string View { get; set; }
        /// <summary>
        /// Number of columns in ImageListView mode
        /// </summary>
        public int? ImageListColumns { get; set; }
        /// <summary>
        /// Number of rows in ImageListView mode
        /// </summary>
        public int? ImageListRows { get; set; }
        public SiteRequest AddSortBy(string sortBy, bool defaultDesc)
        {
            return SortBy(sortBy, true, defaultDesc);
        }
        public SiteRequest SetSortBy(string sortBy, bool defaultDesc)
        {
            return SortBy(sortBy, false, defaultDesc);
        }
        public SiteRequest NextPage()
        {
            var req = Clone();
            req.Skip += req.Take;
            return req;
        }
        public SiteRequest PreviousPage()
        {
            var req = Clone();
            req.Skip -= req.Take;
            if (req.Skip < 0)
                req.Skip = 0;
            return req;
        }
        public SiteRequest ToggleImageListView()
        {
            var req = Clone();
            if(req.View=="ImageList")
            {
                req.View = null;
                req.ImageListColumns = null;
                req.ImageListRows = null;
                req.Skip = null;
                req.Take = null;
            }
            else
            {
                req.View = "ImageList";
            }
            return req;
        }
        SiteRequest SortBy(string sortBy, bool add, bool defaultDesc)
        {
            var req = Clone();
            var col = req.Sort.Columns.Where(t => t.Name == sortBy).FirstOrDefault();
            if (col == null)
            {
                if (!add)
                    req.Sort.Columns.Clear();
                req.Sort.Columns.Add(new SortColumn { Name = sortBy, Descending = defaultDesc });
            }
            else
            {

                col.Descending = !col.Descending;
                if (!add)
                {
                    req.Sort.Columns.Clear();
                    req.Sort.Columns.Add(col);
                }
            }
            return req;

        }

        public string ToJavaScript()
        {
            return ToString().ToJavaScript();
        }
        public SiteRequest Clone(Action<SiteRequest> changes)
        {
            var req = Clone();
            changes(req);
            return req;
        }
        public SiteRequest Clone()
        {
            return new SiteRequest
            {
                Path = Path,
                Sort = Sort.Clone(),
                HideFiles = HideFiles,
                HideFolders = HideFolders,
                FolderSize = FolderSize,
                MixFilesAndFolders = MixFilesAndFolders,
                ShowHiddenFiles = ShowHiddenFiles,
                NoCache = NoCache,
                View = View,
                Skip = Skip,
                Take = Take,
                ImageListColumns = ImageListColumns,
                ImageListRows = ImageListRows,
                KeepView = KeepView,
                IsRecursive = IsRecursive,
                SearchPattern=SearchPattern,
         };
        }
        public static SiteRequest Load(HttpRequest request)
        {
            return new SiteRequest
            {
                Path = request.QueryString["p"] ?? "",
                Sort = SortRequest.Parse(request.QueryString["s"] ?? "Name"),
                //SortBy = request.QueryString["s"] ?? "Name",
                //SortDescending = request.QueryString["d"] == "1",
                HideFolders = request.QueryString["hd"] == "1",
                HideFiles = request.QueryString["hf"] == "1",
                FolderSize = request.QueryString["fs"] == "1",
                MixFilesAndFolders = request.QueryString["mix"] == "1",
                ShowHiddenFiles = request.QueryString["shf"] == "1",
                NoCache = request.QueryString["noc"] == "1",
                View = request.QueryString["v"],
                Skip = Parse.TryInt(request.QueryString["skip"]),
                Take = Parse.TryInt(request.QueryString["take"]),
                ImageListColumns = Parse.TryInt(request.QueryString["ilcols"]),
                ImageListRows = Parse.TryInt(request.QueryString["ilrows"]),
                KeepView = request.QueryString["kv"]=="1",
                SearchPattern = request.QueryString["sp"],
                IsRecursive = request.QueryString["r"]=="1",
            };
        }
        public string GetHref()
        {
            return ToString();
        }
        public override string ToString()
        {
            var dic = Serialize();
            var qs = dic.StringConcat(t => t.Key + "=" + t.Value.ToQueryStringValue(), "", "&", "");
            qs = "?" + qs;
            return qs;
        }

        public Dictionary<string, string> Serialize()
        {
            var dic = new Dictionary<string, string>();
            dic.Add("p", Path);
            if (Sort != null && Sort.Columns.Count > 0)
            {
                if (Sort.Columns.Count == 1 && Sort.Columns[0].Name == "Name" && !Sort.Columns[0].Descending)
                {
                }
                else
                {
                    dic.Add("s", Sort.ToString());
                }
            }
            if (HideFiles)
                dic.Add("hf", "1");
            if (HideFolders)
                dic.Add("hd","1");
            if (FolderSize)
                dic.Add("fs", "1");
            if (MixFilesAndFolders)
                dic.Add("mix", "1");
            if (ShowHiddenFiles)
                dic.Add("shf", "1");
            if (NoCache)
                dic.Add("noc", "1");
            if (View.IsNotNullOrEmpty())
                dic.Add("v", View);
            if (ImageListColumns != null)
                dic.Add("ilcols", ImageListColumns.ToString());
            if (ImageListRows != null)
                dic.Add("ilrows", ImageListRows.ToString());
            if (Skip != null)
                dic.Add("skip", Skip.ToString());
            if (Take != null)
                dic.Add("take", Take.ToString());
            if (KeepView)
                dic.Add("kv", "1");
            if (SearchPattern.IsNotNullOrEmpty())
                dic.Add("sp", SearchPattern);
            if (IsRecursive)
                dic.Add("r", "1");
            return dic;
        }

        public bool KeepView { get; set; }

        /// <summary>
        /// How many items to skip, null means no skipping
        /// </summary>
        public int? Skip { get; set; }
        /// <summary>
        /// How many items to take after skipping, null means all of them
        /// </summary>
        public int? Take { get; set; }
    }

    [JsType(JsMode.Json)]
    public class ListFilesRequest : SiteRequest
    {
    }
    [JsType(JsMode.Json)]
    public class ListFilesResponse
    {
        public File File { get; set; }
        public List<File> Files { get; set; }
        public FileRelativesInfo Relatives { get; set; }
    }


    [JsType(JsMode.Json)]
    public class SortRequest
    {
        public SortRequest()
        {
            Columns = new List<SortColumn>();
        }
        public SortRequest Clone()
        {
            return new SortRequest { Columns = Columns.Select(t => t.Clone()).ToList() };
        }
        public bool Contains(string col)
        {
            return Columns.Where(t => t.Name == col).FirstOrDefault() != null;
        }
        public static SortRequest Parse(string s)
        {
            var req = new SortRequest();
            if (s.IsNotNullOrEmpty())
            {
                s.Split(',').ForEach(t =>
                {
                    var tokens = t.Split(' ');
                    var col = new SortColumn { Name = tokens[0] };
                    if (tokens.Length == 2)
                        col.Descending = tokens[1].EqualsIgnoreCase("d");
                    req.Columns.Add(col);
                });
            }
            return req;
        }
        public override string ToString()
        {
            return Columns.StringConcat(t => t.Descending ? t.Name + " d" : t.Name, "", ",", "");
        }
        public List<SortColumn> Columns { get; set; }
    }

    [JsType(JsMode.Json)]
    public class SortColumn
    {
        public string Name { get; set; }
        public bool Descending { get; set; }

        public SortColumn Clone()
        {
            return new SortColumn { Name = Name, Descending = Descending };
        }
    }


    [JsType(JsMode.Json)]
    public class PathRequest
    {
        public string Path { get; set; }
    }


}