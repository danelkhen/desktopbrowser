using SharpKit.JavaScript;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DesktopBrowser.client.utils
{
    [JsType(JsMode.Json)]
    class Unit
    {
        public JsNumber Value { get; set; }

        public JsString Type { get; set; }
    }

    [JsType(JsMode.Prototype, Name="Timer", Export=false)]
    public class Timer
    {
        public Timer(JsAction action, JsNumber ms)
        {

        }
        public Timer(JsAction action)
        {

        }

        public void set()
        {

        }
        public void set(JsNumber ms)
        {
            
        }
    }
}
