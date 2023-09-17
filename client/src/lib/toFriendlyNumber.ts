import { stringRemoveLast } from "./stringRemoveLast"

export function toFriendlyNumber(x: number): string {
    let s: string
    if (x == 0) return "0"
    if (x > 0 && x < 10) s = x.toFixed(2)
    else if (x >= 10 && x < 100) s = x.toFixed(1)
    else s = x.toFixed(0)
    //while (s.endsWith("0"))
    //    s = s.removeLast(1);
    if (s.endsWith(".0")) s = stringRemoveLast(s, 2)
    if (s.endsWith(".00")) s = stringRemoveLast(s, 3)
    return s
}
