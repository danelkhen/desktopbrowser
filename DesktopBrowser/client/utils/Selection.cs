using System;
using SharpKit.JavaScript;
using SharpKit.jQuery;

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
            var sel = SelectedItems.toArray();
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
                sel.add(anchor);
                sel.addRange(slice.where(t => t.As<object>() != anchor.As<object>()));
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
        public void KeyDown(Event e)
        {
            var keyCode = e.keyCode;
            var ctrl = e.ctrlKey;
            var sel = SelectedItems.toArray();
            var lastActive = SelectedItems.last();
            if (lastActive == null)
            {
                if (AllItems.length > 0)
                {
                    SetSelection(new JsArray<T> { AllItems[0] });
                    e.preventDefault();
                }
                return;
            }
            var offset = 0;
            if (keyCode == Keys.Down)
                offset = 1;
            else if (keyCode == Keys.Up)
                offset = -1;
            else if (keyCode == Keys.PageDown)
                offset = AllItems.length;
            else if (keyCode == Keys.PageUp)
                offset = AllItems.length * -1;
            var sibling = AllItems.GetSiblingOrEdge(lastActive, offset);
            if (sibling == null || sibling.ExactEquals(lastActive))
                return;
            e.preventDefault();
            if (ctrl)
                AddToSelection(sibling);
            else
                SetSelection(new JsArray<T> { sibling });
        }

        void AddToSelection(T item)
        {
            if (SelectedItems.contains(item))
                return;
            var sel = SelectedItems.toArray();
            sel.push(item);
            SetSelection(sel);
        }
        void SetSelection(JsArray<T> sel)
        {
            if (sel.itemsEqual(SelectedItems) || sel == SelectedItems)
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
