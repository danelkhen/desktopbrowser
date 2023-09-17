import { arrayItemsEqual } from "../lib/arrayItemsEqual"
import { Keys } from "../lib/Keys"

export class Selection<T> {
    constructor(
        public readonly AllItems: T[],
        public readonly SelectedItems: T[]
    ) {}

    Toggle(list: T[], item: T): void {
        const index = list.indexOf(item)
        if (index < 0) list.push(item)
        else list.splice(index, 1)
    }

    get selectedItem() {
        return this.SelectedItems[this.SelectedItems.length - 1]
    }

    Click(item: T, ctrl: boolean, shift: boolean): T[] {
        let sel = [...this.SelectedItems]
        const anchor = this.SelectedItems[0]

        if (ctrl) {
            this.Toggle(sel, item)
        } else if (shift && anchor != null) {
            const index1 = this.AllItems.indexOf(anchor)
            const index2 = this.AllItems.indexOf(item)

            const minIndex = Math.min(index1, index2)
            const maxIndex = Math.max(index1, index2)
            const slice = this.AllItems.slice(minIndex, maxIndex + 1)
            sel = [anchor, ...slice.filter(t => t != anchor)]
        } else {
            sel = [item]
        }

        if (arrayItemsEqual(sel, this.SelectedItems)) {
            return this.SelectedItems
        }
        return sel
    }
    KeyDown(e: KeyboardEvent): T[] {
        const keyCode = e.keyCode
        const ctrl = e.ctrlKey
        // var sel = this.SelectedItems.toArray();
        const lastActive = this.selectedItem
        if (lastActive == null) {
            if (this.AllItems.length > 0 && [Keys.Down, Keys.Up, Keys.PageDown, Keys.PageUp].includes(keyCode)) {
                this.SetSelection([this.AllItems[0]])
                e.preventDefault()
            }
            return this.SelectedItems
        }
        let offset = 0
        if (keyCode == Keys.Down) offset = 1
        else if (keyCode == Keys.Up) offset = -1
        else if (keyCode == Keys.PageDown) offset = this.AllItems.length
        else if (keyCode == Keys.PageUp) offset = this.AllItems.length * -1
        const sibling = GetSiblingOrEdge(this.AllItems, lastActive, offset)
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
        const sel = [...this.SelectedItems]
        sel.push(item)
        return this.SetSelection(sel)
    }
    SetSelection(sel: T[]): T[] {
        if (arrayItemsEqual(sel, this.SelectedItems) || sel == this.SelectedItems) {
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
    let index = list.indexOf(item)
    const newIndex = (index += offset)
    if (newIndex < 0 || newIndex >= list.length) {
        if (offset > 0) return list[list.length - 1]
        return list[0]
    }
    return list[newIndex]
}
