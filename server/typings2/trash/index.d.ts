declare module "trash" {
    function trash(input: Iterable<string>): Promise<any>;
    namespace trash { }
    export = trash;
}