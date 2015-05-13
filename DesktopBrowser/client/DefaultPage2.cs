using DesktopBrowser.client;
using DesktopBrowser.client.utils;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKit.jQuery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.client
{

    [JsType(JsMode.Prototype, Filename = "~/res/js/default2.js")]
    public class DefaultPage2
    {
        public DefaultPage2()
        {
            new jQuery(OnDomReady);
        }

        private void OnDomReady()
        {
            var service = new SiteServiceClient();

        }
    }

}