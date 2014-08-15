using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.Server.Utils
{
    public class Size : IComparable<Size>
    {
        public double Bytes { get; set; }
        public Size(double bytes)
        {
            Bytes = bytes;
        }
        public override string ToString()
        {
            var kb = Bytes / 1024.0;
            var mb = kb / 1024.0;
            var gb = mb / 1024.0;
            var tb = gb / 1024.0;
            if (kb < 1)
                return String.Format("{0} b", Bytes);
            if (mb < 1)
                return String.Format("{0:0.#} kb", kb);
            if (gb < 1)
                return String.Format("{0:0.#} mb", mb);
            if (tb < 1)
                return String.Format("{0:0.#} gb", gb);
            return String.Format("{0:0.#} tb", tb);
        }


        #region IComparable<Size> Members

        public int CompareTo(Size other)
        {
            if (other == null)
                return -1;
            return Bytes.CompareTo(other.Bytes);
        }

        #endregion
    }
}