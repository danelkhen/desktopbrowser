import { Keys } from "../utils/Keys"
import { itemsAre } from "../../../shared/src"

export class Selection<T> {
    constructor(public readonly AllItems: T[], public readonly SelectedItems: T[]) {}

    Toggle(list: T[], item: T): void {
        var index = list.indexOf(item)
        if (index < 0) list.push(item)
        else list.splice(index, 1)
    }

    get selectedItem() {
        return this.SelectedItems[this.SelectedItems.length - 1]
    }

    Click(item: T, ctrl: boolean, shift: boolean): T[] {
        var sel = [...this.SelectedItems]
        var anchor = this.SelectedItems[0]

        if (ctrl) {
            this.Toggle(sel, item)
        } else if (shift && anchor != null) {
            var index1 = this.AllItems.indexOf(anchor)
            var index2 = this.AllItems.indexOf(item)

            var minIndex = Math.min(index1, index2)
            var maxIndex = Math.max(index1, index2)
            var slice = this.AllItems.slice(minIndex, maxIndex + 1)
            sel = [anchor, ...slice.filter(t => t != anchor)]
        } else {
            sel = [item]
        }

        if (sel[itemsAre](this.SelectedItems)) {
            return this.SelectedItems
        }
        return sel
    }
    KeyDown(e: KeyboardEvent): T[] {
        var keyCode = e.keyCode
        var ctrl = e.ctrlKey
        // var sel = this.SelectedItems.toArray();
        var lastActive = this.selectedItem
        if (lastActive == null) {
            if (this.AllItems.length > 0 && [Keys.Down, Keys.Up, Keys.PageDown, Keys.PageUp].includes(keyCode)) {
                this.SetSelection([this.AllItems[0]])
                e.preventDefault()
            }
            return this.SelectedItems
        }
        var offset = 0
        if (keyCode == Keys.Down) offset = 1
        else if (keyCode == Keys.Up) offset = -1
        else if (keyCode == Keys.PageDown) offset = this.AllItems.length
        else if (keyCode == Keys.PageUp) offset = this.AllItems.length * -1
        var sibling = GetSiblingOrEdge(this.AllItems, lastActive, offset)
        if (sibling == null || sibling === lastActive) {
            return this.SelectedItems
        }

        e.preventDefault()
        if (ctrl) {
            return this.AddToSelection(sibling)
        }
        return this.SetSelection([sibling])
    }

    AddToSelection(item: T): T[] {
        if (this.SelectedItems.includes(item)) return this.SelectedItems
        var sel = [...this.SelectedItems]
        sel.push(item)
        return this.SetSelection(sel)
    }
    SetSelection(sel: T[]): T[] {
        if (sel[itemsAre](this.SelectedItems) || sel == this.SelectedItems) {
            return this.SelectedItems
        }
        return sel
    }
}

export interface SelectionChangedEventArgs<T> {
    From: T[]
    To: T[]
}

function GetSiblingOrEdge<T>(list: T[], item: T, offset: number): T {
    if (offset == null || offset == 0) return item
    var index = list.indexOf(item)
    var newIndex = (index += offset)
    if (newIndex < 0 || newIndex >= list.length) {
        if (offset > 0) return list[list.length - 1]
        return list[0]
    }
    return list[newIndex]
}
