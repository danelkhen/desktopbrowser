declare module "trash" {
    function trash(input: Iterable<string>): Promise<void>
    namespace trash {}
    export = trash
}
