export class Name {
   static of<T>(): NameFunc<T> {
        return nameof;
    }
}
export interface NameFunc<T> {
    (prop: SelectorFunc<T, any>): string
}

export function nameof<T>(prop: SelectorFunc<T, any>): string {
    let prop2: any = prop;
    let code: string;
    if (prop2.isDelegate)
        code = prop2.func.toString();
    else
        code = prop.toString();
    return code.substringBetween(".", ";");
}
