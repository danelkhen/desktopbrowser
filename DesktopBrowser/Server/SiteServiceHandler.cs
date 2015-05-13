using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Script.Serialization;

namespace DesktopBrowser.Server
{

    public class SiteServiceHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var obj = new SiteService();
            var type = obj.GetType();
            var action = context.Request.PathInfo.Substring(1);
            var mi = type.GetMethod(action, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
            if (mi == null)
                throw new Exception("Action " + action + " not found");
            var pi = mi.GetParameters().FirstOrDefault();
            var prms = new List<object>();

            if (pi != null)
            {
                object prm;
                if (context.Request.HttpMethod == "GET")
                {
                    var dic = new Dictionary<string, object>();
                    foreach (var key in context.Request.QueryString.AllKeys)
                    {
                        dic[key] = context.Request.QueryString[key];
                    }
                    prm = GetSerializer().ConvertToType(dic, pi.ParameterType);

                }
                else
                {
                    var s = new StreamReader(context.Request.InputStream).ReadToEnd();
                    prm = GetSerializer().Deserialize(s, pi.ParameterType);
                }
                prms.Add(prm);
            }

            string res;
            var status = 200;
            Exception error = null;
            object returnValue = null;
            try
            {
                returnValue = mi.Invoke(obj, prms.ToArray());
            }
            catch (TargetInvocationException e)
            {
                error = e.InnerException;
            }

            if (error != null)
            {
                var dic = new Dictionary<string, object>();
                dic["Message"] = error.Message;
                dic["Type"] = error.GetType().Name;
                res = GetSerializer().Serialize(dic);
                status = 500;
            }
            else
            {
                res = GetSerializer().Serialize(returnValue);

            }

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";
            context.Response.Write(res);
        }

        JavaScriptSerializer GetSerializer()
        {
            var ser = new JavaScriptSerializer();
          //  ser.RegisterConverters(new[] { new DateTimeJavaScriptConverter() });
            return ser;

        }
        string Serialize(object obj)
        {
            var s = GetSerializer().Serialize(obj);
            return s;

        }


    }

    //class DateTimeJsConverter : JavaScriptConverter
    //{
    //    Type[] _SupportedTypes = new Type[] { typeof(DateTime) };
    //    public override IEnumerable<Type> SupportedTypes { get { return _SupportedTypes; } }

    //    public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
    //    {
    //        throw new NotImplementedException();
    //    }
    //}


    public class DateTimeJavaScriptConverter : JavaScriptConverter
    {
        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            return new JavaScriptSerializer().ConvertToType(dictionary, type);
        }

        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            if (!(obj is DateTime)) return null;
            var dt = (DateTime)obj;
            var s = dt.ToString("yyyy-MM-dd HH:mm:ss");
            return new CustomString(s);
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get { return new[] { typeof(DateTime) }; }
        }

        private class CustomString : IDictionary<string, object>, IConvertible
        {
            string Value;
            public CustomString(string str)
            {
                Value = str;
            }
            public override string ToString()
            {
                return Value;
            }
            public static implicit operator string (CustomString s)
            {
                return s.Value;
            }

            void IDictionary<string, object>.Add(string key, object value)
            {
                throw new NotImplementedException();
            }

            bool IDictionary<string, object>.ContainsKey(string key)
            {
                throw new NotImplementedException();
            }

            ICollection<string> IDictionary<string, object>.Keys
            {
                get { throw new NotImplementedException(); }
            }

            bool IDictionary<string, object>.Remove(string key)
            {
                throw new NotImplementedException();
            }

            bool IDictionary<string, object>.TryGetValue(string key, out object value)
            {
                throw new NotImplementedException();
            }

            ICollection<object> IDictionary<string, object>.Values
            {
                get { throw new NotImplementedException(); }
            }

            object IDictionary<string, object>.this[string key]
            {
                get
                {
                    throw new NotImplementedException();
                }
                set
                {
                    throw new NotImplementedException();
                }
            }

            void ICollection<KeyValuePair<string, object>>.Add(KeyValuePair<string, object> item)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyValuePair<string, object>>.Clear()
            {
                throw new NotImplementedException();
            }

            bool ICollection<KeyValuePair<string, object>>.Contains(KeyValuePair<string, object> item)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyValuePair<string, object>>.CopyTo(KeyValuePair<string, object>[] array, int arrayIndex)
            {
                throw new NotImplementedException();
            }

            int ICollection<KeyValuePair<string, object>>.Count
            {
                get { throw new NotImplementedException(); }
            }

            bool ICollection<KeyValuePair<string, object>>.IsReadOnly
            {
                get { throw new NotImplementedException(); }
            }

            bool ICollection<KeyValuePair<string, object>>.Remove(KeyValuePair<string, object> item)
            {
                throw new NotImplementedException();
            }

            IEnumerator<KeyValuePair<string, object>> IEnumerable<KeyValuePair<string, object>>.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            public TypeCode GetTypeCode()
            {
                throw new NotImplementedException();
            }

            public bool ToBoolean(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public char ToChar(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public sbyte ToSByte(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public byte ToByte(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public short ToInt16(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public ushort ToUInt16(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public int ToInt32(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public uint ToUInt32(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public long ToInt64(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public ulong ToUInt64(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public float ToSingle(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public double ToDouble(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public decimal ToDecimal(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public DateTime ToDateTime(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public string ToString(IFormatProvider provider)
            {
                throw new NotImplementedException();
            }

            public object ToType(Type conversionType, IFormatProvider provider)
            {
                throw new NotImplementedException();
            }
        }
    }

}