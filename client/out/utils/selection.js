"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Selection = (function () {
    function Selection() {
        this.SelectedItems = [];
        this.AllItems = [];
    }
    Selection.prototype.Toggle = function (list, item) {
        var index = list.indexOf(item);
        if (index < 0)
            list.push(item);
        else
            list.removeAt(index);
    };
    Selection.prototype.Click = function (item, ctrl, shift) {
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
            sel.addRange(slice.where(function (t) { return t != anchor; }));
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
    };
    Selection.prototype.KeyDown = function (e) {
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
    };
    Selection.prototype.AddToSelection = function (item) {
        if (this.SelectedItems.contains(item))
            return;
        var sel = this.SelectedItems.toArray();
        sel.push(item);
        this.SetSelection(sel);
    };
    Selection.prototype.SetSelection = function (sel) {
        if (sel.itemsEqual(this.SelectedItems) || sel == this.SelectedItems)
            return;
        var prevSelection = this.SelectedItems;
        this.SelectedItems = sel;
        this.OnChanged({ From: prevSelection, To: this.SelectedItems });
    };
    Selection.prototype.OnChanged = function (e) {
        var diff = e.From.diff(e.To);
        e.Added = diff.added;
        e.Removed = diff.removed;
        if (this.Changed != null)
            this.Changed(e);
    };
    return Selection;
}());
exports.Selection = Selection;
//# sourceMappingURL=selection.js.map