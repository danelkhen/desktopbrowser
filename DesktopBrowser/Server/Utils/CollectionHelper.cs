using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
//using SharpKit.Extensions;
//using CodeRun.JavaScript.Extensions;

namespace DesktopBrowser.Server.Utils
{
	public static class EnumerableHelper
	{
		public static Type GetEnumerableItemType(object typedEnumerable)
		{
			var type = typedEnumerable.GetType();
			return GetEnumerableItemType(type);
		}
		public static Type GetEnumerableItemType(Type type)
		{
			var iface = type.GetInterface("System.Collections.Generic.IEnumerable`1");
			if (iface != null)
			{
				var args = iface.GetGenericArguments();
				return args[0];
			}
			return null;
		}
	}

	internal static class CollectionHelper
	{
		public static bool ContainsNull(IList list)
		{
			foreach (object obj in list)
			{
				if (obj == null)
					return true;
			}
			return false;
		}
		public static T[] ToArray<T>(IList<T> list)
		{
			T[] array = new T[list.Count];
			list.CopyTo(array, 0);
			return array;
		}

		public static string ToString(IEnumerable items, string separator)
		{
			return ToString(items, separator, "", "");
		}

		public static string ToString(IEnumerable items, string separator, string prefix, string suffix)
		{
			StringBuilder sb = new StringBuilder();
			bool first = true;
			foreach (object item in items)
			{
				if (first)
				{
					first = false;
				}
				else
				{
					sb.Append(separator);
				}
				sb.Append(prefix);
				sb.Append(item);
				sb.Append(suffix);
			}
			return sb.ToString();
		}

	}
}
