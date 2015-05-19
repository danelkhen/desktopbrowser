using System;
using SharpKit.JavaScript;

namespace DesktopBrowser.client.utils
{
    [JsType(JsMode.Prototype)]
    class Selection<T>
    {
        public Selection()
        {
            SelectedItems = new JsArray<T>();
            AllItems = new JsArray<T>();
        }

        void Toggle(JsArray<T> list, T item)
        {
            var index = list.indexOf(item);
            if (index < 0)
                list.push(item);
            else
                list.removeAt(index);
        }

        public JsArray<T> SelectedItems { get; set; }
        public JsArray<T> AllItems { get; set; }
        public void Click(T item, bool ctrl, bool shift)
        {
            var sel = SelectedItems.toList();
            var lastActive = SelectedItems.last();
            var anchor = SelectedItems.first();

            if (ctrl)
            {
                Toggle(sel, item);
            }
            else if (shift && anchor != null)
            {
                var index1 = AllItems.indexOf(anchor);
                var index2 = AllItems.indexOf(item);

                var minIndex = JsMath.min(index1, index2);
                var maxIndex = JsMath.max(index1, index2);
                var slice = AllItems.slice(minIndex, maxIndex + 1);
                sel.clear();
                sel.addRange(slice);
            }
            else
            {
                sel.clear();
                sel.push(item);
            }

            if (sel.itemsEqual(SelectedItems))
                return;
            var prevSelection = SelectedItems;
            SelectedItems = sel;

            OnChanged(new SelectionChangedEventArgs<T> { From = prevSelection, To = SelectedItems });
        }

        public JsAction<SelectionChangedEventArgs<T>> Changed { get; set; }
        private void OnChanged(SelectionChangedEventArgs<T> e)
        {
            var diff = e.From.diff(e.To);
            e.Added = diff.added;
            e.Removed = diff.removed;
            if (Changed != null)
                Changed(e);
        }
    }

    [JsType(JsMode.Json)]
    class SelectionChangedEventArgs<T>
    {
        public JsArray<T> From { get; set; }
        public JsArray<T> To { get; set; }
        public JsArray<T> Added { get; set; }
        public JsArray<T> Removed { get; set; }

    }
}
