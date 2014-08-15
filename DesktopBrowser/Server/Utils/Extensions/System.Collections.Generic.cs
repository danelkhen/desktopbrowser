using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace System.Collections.Generic.Extensions
{
    internal static class Extensions
    {
        public static T GetValue<K, T>(this Dictionary<K, T> dic, K key, Func<K, T> notFoundHandler)
        {
            T value;
            if (!dic.TryGetValue(key, out value))
                return notFoundHandler(key);
            return value;
        }

        public static bool TryAdd<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key, TValue value)
        {
            if (dic.ContainsKey(key))
                return false;
            dic.Add(key, value);
            return true;
        }

        public static bool TryRemove<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key)
        {
            if (dic.ContainsKey(key))
            {
                dic.Remove(key);
                return true;
            }
            return false;
        }

        public static TValue TryGetValue<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key)
        {
            TValue value;
            dic.TryGetValue(key, out value);
            return value;
        }

        public static TValue GetCreateValue<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key) where TValue : new()
        {
            TValue value;
            if (!dic.TryGetValue(key, out value))
            {
                value = new TValue();
                dic[key] = value;
            }
            return value;
        }

        public static TValue GetCreateValueSynchronized<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key, object sync) where TValue : new()
        {
            TValue value;
            if (!dic.TryGetValue(key, out value))
            {
                lock (sync)
                {
                    value = GetCreateValue(dic, key);
                }
            }
            return value;
        }

    }
}
