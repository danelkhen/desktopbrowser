"use strict"
export class Selection<T>
{
    constructor() {
        this.SelectedItems = [];
        this.AllItems = [];
    }

    Toggle(list: T[], item: T): void {
        var index = list.indexOf(item);
        if (index < 0)
            list.push(item);
        else
            list.removeAt(index);
    }

    SelectedItems: T[];
    AllItems: T[];

    Click(item: T, ctrl: boolean, shift: boolean): void {
        var sel = this.SelectedItems.toArray();
        var lastActive = this.SelectedItems.last();
        var anchor = this.SelectedItems.first();

        if (ctrl) {
            this.Toggle(sel, item);
        }
        else if (shift && anchor != null) {
            var index1 = this.AllItems.indexOf(anchor);
            var index2 = this.AllItems.indexOf(item);

            var minIndex = Math.min(index1, index2);
            var maxIndex = Math.max(index1, index2);
            var slice = this.AllItems.slice(minIndex, maxIndex + 1);
            sel.clear();
            sel.add(anchor);
            sel.addRange(slice.where(t => t != anchor));
        }
        else {
            sel.clear();
            sel.push(item);
        }

        if (sel.itemsEqual(this.SelectedItems))
            return;
        var prevSelection = this.SelectedItems;
        this.SelectedItems = sel;

        this.OnChanged({ From: prevSelection, To: this.SelectedItems });
    }
    KeyDown(e: JQueryKeyEventObject): void {
        var keyCode = e.keyCode;
        var ctrl = e.ctrlKey;
        var sel = this.SelectedItems.toArray();
        var lastActive = this.SelectedItems.last();
        if (lastActive == null) {
            if (this.AllItems.length > 0 && [Keys.Down, Keys.Up, Keys.PageDown, Keys.PageUp].contains(keyCode)) {
                this.SetSelection([this.AllItems[0]]);
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
            offset = this.AllItems.length;
        else if (keyCode == Keys.PageUp)
            offset = this.AllItems.length * -1;
        var sibling = this.AllItems.GetSiblingOrEdge(lastActive, offset);
        if (sibling == null || sibling === lastActive)
            return;
        e.preventDefault();
        if (ctrl)
            this.AddToSelection(sibling);
        else
            this.SetSelection([sibling]);
    }

    AddToSelection(item: T): void {
        if (this.SelectedItems.contains(item))
            return;
        var sel = this.SelectedItems.toArray();
        sel.push(item);
        this.SetSelection(sel);
    }
    SetSelection(sel: T[]): void {
        if (sel.itemsEqual(this.SelectedItems) || sel == this.SelectedItems)
            return;
        var prevSelection = this.SelectedItems;
        this.SelectedItems = sel;

        this.OnChanged({ From: prevSelection, To: this.SelectedItems });
    }

    Changed: JsAction1<SelectionChangedEventArgs<T>>;
    OnChanged(e: SelectionChangedEventArgs<T>): void {
        var diff = e.From.diff(e.To);
        e.Added = diff.added;
        e.Removed = diff.removed;
        if (this.Changed != null)
            this.Changed(e);
    }
}


export interface SelectionChangedEventArgs<T> {
    From: T[];
    To: T[];
    Added?: T[];
    Removed?: T[];

}

