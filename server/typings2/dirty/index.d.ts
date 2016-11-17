declare module "dirty" {
    function dirty<T>(filename: string): dirty.Dirty<T>;

    namespace dirty {
        interface Dirty<T> {
            /**Emitted once the database file has finished loading.It is not safe to access records before this event fires.Writing records however should be fine.
            length is the amount of records the database is holding.This only counts each key once, even if it had been overwritten.
            You can chain the on load to the contructor as follows:
            var db = dirty(file).on('load', function () { ... });*/
            on(ev: "load", cb: () => void): void;
            /**Emitted whenever all records have been written to disk.*/
            on(ev: "drain", cb: () => void): void;
            /**Emitted once the database file read stream closed.*/
            on(ev: 'read_close', cb: () => void): void;
            /**Emitted once the database file write stream closed.*/
            on(ev: 'write_close', cb: () => void): void;
            /**        Set's the given key / val pair. The state of the database is affected instantly, the optional cb callback is fired when the record was written to disk.*/
            set(key: string, value: T, cb?: () => void): void;
            /**Retrieves the value for the given key.
            val can be any JSON- serializable type, it does not have to be an object.*/
            get(key: string): T;
            /**Calls the given fn function for every document in the database. The passed arguments are key and val. You can return false to abort a query (useful if you are only interested in a limited number of records).
This function is blocking and runs at ~4 Mhz.*/
            forEach(cb: (key: string, value: T) => void): void;
            /** The path of the dirty database.*/
            path: string;
            /**Removes the record with the given key.This is identical to setting the key's value to undefined.*/
            rm(key, cb)
            /**Updates the record of the given key with the given updater which is a function that is passed the current value of the key.
            The optional cb callback is passed to dirty.set.*/
            update(key: string, updater: (value: T) => T, cb?: () => void): void;
            /**Close the dirty db file handle.*/
            close()


        }
    }
    export = dirty;
}