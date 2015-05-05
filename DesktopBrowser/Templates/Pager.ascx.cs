using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DesktopBrowser.Server;

namespace DesktopBrowser.Templates
{
    public partial class Pager : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Page = base.Page as Default;
            Foo();
        }
        public string PreviousDisabled { get; set; }
        public new Default Page { get; set; }

        public SiteRequest SiteRequest { get; set; }

        void Foo()
        {
            if (SiteRequest.Skip == 0)
                PreviousDisabled = " disabled";
            Selects = new List<Select>();
            if (SiteRequest.View == "ImageList")
            {
                var select1 = new Select { Options = new List<Option>(), Label = "Columns" };
                for (var i = 1; i <= 10; i++)
                {
                    var option = new Option { Value = SiteRequest.Clone(t => t.ImageListColumns = i).GetHref(), Label = i.ToString() };
                    select1.Options.Add(option);
                    if (SiteRequest.ImageListColumns == i)
                        option.IsSelected = true;
                }
                Selects.Add(select1);
                var select2 = new Select { Options = new List<Option>(), Label = "Rows" };
                for (var i = 1; i <= 10; i++)
                {
                    var option = new Option { Value = SiteRequest.Clone(t => t.ImageListRows = i).GetHref(), Label = i.ToString() };
                    select2.Options.Add(option);
                    if (SiteRequest.ImageListRows == i)
                        option.IsSelected = true;
                }
                Selects.Add(select2);
            }
            else
            {
                var select1 = new Select { Options = new List<Option>(), Label = SiteRequest.Take.ToString() };
                var pageSizes = new[] { 1, 5, 25, 50, 100, 300, 500, 1000, 2500, 5000 };
                foreach (var p in pageSizes)
                {
                    var option = new Option { Value = SiteRequest.Clone(t => t.Take = p).GetHref(), Label = p.ToString() };
                    select1.Options.Add(option);
                    if (SiteRequest.Take == p)
                        option.IsSelected = true;
                }
                Selects.Add(select1);

            }

        }

        public List<Select> Selects { get; set; }
    }

    public class Select
    {
        public string Label { get; set; }
        public List<Option> Options { get; set; }
    }

    public class Option
    {
        public string Label { get; set; }
        public string Value { get; set; }
        public bool IsSelected { get; set; }
    }

}