using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopBrowser.Server.Utils
{
    /// <summary>
    /// Wraps an IEnumerable&lt;T&gt; and provides a thread-safe means of caching the values."/>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    class CachedEnumerable<T> : IEnumerable<T>
    {
        // An enumerator from the original IEnumerable<T>
        private IEnumerator<T> enumerator;

        // The items we have already cached (from this.enumerator)
        private IList<T> cachedItems = new List<T>();

        public CachedEnumerable(IEnumerable<T> enumerable)
        {
            this.enumerator = enumerable.GetEnumerator();
        }

        #region IEnumerable<T> Members

        public IEnumerator<T> GetEnumerator()
        {
            // The index into the sequence
            int currentIndex = 0;

            // We will break with yield break 
            while (true)
            {
                // The currentIndex will never be decremented,
                // so we can check without locking first
                if (currentIndex < this.cachedItems.Count)
                {
                    var current = this.cachedItems[currentIndex];
                    currentIndex += 1;
                    yield return current;
                }
                else
                {
                    // See if we have more cached items ...
                    if (currentIndex < this.cachedItems.Count)
                    {
                        var current = this.cachedItems[currentIndex];
                        currentIndex += 1;
                        yield return current;
                    }
                    else
                    {
                        // ... otherwise, we'll need to get the next item from this.enumerator.MoveNext()
                        if (this.enumerator.MoveNext())
                        {
                            // capture the current item and cache it, then increment the currentIndex
                            var current = this.enumerator.Current;
                            this.cachedItems.Add(current);
                            currentIndex += 1;
                            yield return current;
                        }
                        else
                        {
                            // We reached the end of the enumerator - we're done
                            yield break;
                        }
                    }
                }
            }
        }

        #endregion

        #region IEnumerable Members

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        #endregion
    }
}