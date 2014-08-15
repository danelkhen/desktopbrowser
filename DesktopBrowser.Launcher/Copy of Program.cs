//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Diagnostics;
//using System.IO;
//using System.Threading;
//using System.Xml.Linq;

//namespace DesktopBrowser.Launcher
//{
//    class ProgramOptions
//    {
//        public bool? AllowEthernetAccess { get; set; }
//        public bool? RestartIIS { get; set; }
//    }

//    class IISConfig
//    {
//        public string ConfigFilename { get; set; }
//        public string SiteDir { get; set; }
//        public bool AllowEthernetAccess { get; set; }
//    }
//    class Program
//    {
//        static void ConfigureIIS(IISConfig config)
//        {
//            Console.WriteLine("Configuring IIS");
//            var config1 = XDocument.Load(config.ConfigFilename);
//            var site = config1.Descendants("site").First();
//            site.Attribute("name").Value = "DesktopBrowser";
//            site.Descendants("virtualDirectory").First().Attribute("physicalPath").Value = config.SiteDir;
//            var bindings = site.Descendants("bindings").First();
//            bindings.Elements().Remove();
//            AddBinding(bindings, "http", ":7777:localhost");
//            if (config.AllowEthernetAccess)
//            {
//                Console.WriteLine("Ethernet access is enabled for machine name: {0}", Environment.MachineName);
//                AddBinding(bindings, "http", ":7777:" + Environment.MachineName);
//            }
//            config1.Save(config.ConfigFilename);
//        }

//        private static void AddBinding(XElement bindings, string protocol, string bindingInformation)
//        {
//            var binding = new XElement("binding");
//            binding.Add(new XAttribute("protocol", protocol));
//            binding.Add(new XAttribute("bindingInformation", bindingInformation));
//            bindings.Add(binding);
//        }
//        static void Main(string[] args)
//        {
//            try
//            {
//                var options = new ProgramOptions { AllowEthernetAccess = true, RestartIIS = true };

//                var dir = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule.FileName);
//                var configFilename = Path.Combine(dir, "applicationhost.config");
//                ConfigureIIS(new IISConfig { ConfigFilename = configFilename, AllowEthernetAccess = options.AllowEthernetAccess.GetValueOrDefault(), SiteDir = Path.Combine(dir, "DesktopBrowser") });

//                var iisExpress = Environment.ExpandEnvironmentVariables(@"%ProgramFiles(x86)%\IIS Express\iisexpress.exe");
//                if (!File.Exists(iisExpress))
//                    iisExpress = Environment.ExpandEnvironmentVariables(@"%ProgramFiles%\IIS Express\iisexpress.exe");
//                if (!File.Exists(iisExpress))
//                {
//                    Console.WriteLine("Please install IIS Express and try again");
//                    //http://www.microsoft.com/web/gallery/install.aspx?appid=NETFramework4
//                    Process.Start("http://www.microsoft.com/web/gallery/install.aspx?appid=IISExpress");
//                    Console.ReadLine();
//                    return;
//                }

//                var siteDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DesktopBrowser");
//                var procs = Process.GetProcessesByName("iisexpress").ToList();
//                if (procs.Count > 0)
//                {
//                    Console.WriteLine("IIS Express is already running");
//                    if (options.RestartIIS.GetValueOrDefault())
//                    {
//                        Console.WriteLine("Stopping IIS Express");
//                        procs.ForEach(t => t.Kill());
//                        procs.ForEach(t => t.WaitForExit());
//                        procs = Process.GetProcessesByName("iisexpress").ToList();
//                    }
//                }
//                if (procs.Count == 0)
//                {
//                    Console.WriteLine("Starting IIS Express");
//                    var args2 = "/config:ApplicationHost.config";//String.Format("/config:ApplicationHost.config"path:{0} /port:7777", siteDir);
//                    var process = Process.Start(new ProcessStartInfo
//                    {
//                        FileName = iisExpress,
//                        Arguments = args2,
//                        UseShellExecute = false,
//                        CreateNoWindow = true,
//                    });
//                    Thread.Sleep(3000);
//                    if (process.HasExited)
//                    {

//                    }

//                }
//                Console.WriteLine("Launching browser");
//                var url = "http://localhost:7777/";
//                if (options.AllowEthernetAccess.GetValueOrDefault())
//                    url = url.Replace("localhost", Environment.MachineName);
//                Process.Start(url);
//                Thread.Sleep(3000);
//            }
//            catch (Exception e)
//            {
//                Console.WriteLine(e);
//                Console.ReadLine();
//            }
//        }


//    }
//}
