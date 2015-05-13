using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace DesktopBrowser.Launcher
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var iisExpress = Environment.ExpandEnvironmentVariables(@"%ProgramFiles%\IIS Express\iisexpress.exe");
                if (!File.Exists(iisExpress))
                    iisExpress = Environment.ExpandEnvironmentVariables(@"%ProgramFiles(x86)%\IIS Express\iisexpress.exe");
                if (!File.Exists(iisExpress))
                {
                    Console.WriteLine("Please install IIS Express and try again");
                    //http://www.microsoft.com/web/gallery/install.aspx?appid=NETFramework4
                    Process.Start("http://www.microsoft.com/web/gallery/install.aspx?appid=IISExpress");
                    Console.ReadLine();
                    return;
                }

                var siteDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DesktopBrowser");
                var procs = Process.GetProcessesByName("iisexpress").ToList();
                if (procs.Count == 0)
                {
                    Console.WriteLine("Launching IIS Express");
                    var args2 = String.Format("/path:{0} /port:7777", siteDir);
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = iisExpress,
                        Arguments = args2,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                    });
                    Thread.Sleep(3000);
                }
                else
                {
                    Console.WriteLine("IIS Express is already running");
                }
                Console.WriteLine("Launching browser");
                Process.Start("http://localhost:7777/");
                Thread.Sleep(3000);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.ReadLine();
            }
        }


    }
}
