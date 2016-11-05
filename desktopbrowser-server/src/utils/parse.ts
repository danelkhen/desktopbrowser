export class Parse {
    static TryInt(s: string): number {
        let x = parseInt(s);
        if (isNaN(x))
            return null;
        return x;
    }
    static TryBoolean(s: string): boolean {
        if (["1", "true", "True", "TRUE"].contains(s))
            return true;
        return false;
    }

    static TryLong(s: string): number {
        return this.TryInt(s);
    }
}

