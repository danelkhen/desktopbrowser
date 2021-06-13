/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "sqlite3"
import "reflect-metadata"
import {
    Column,
    Connection,
    ConnectionOptions,
    createConnection,
    Entity,
    Index,
    PrimaryColumn,
    Repository,
} from "typeorm"

@Entity({ name: "by_filename" })
export class ByFilename {
    @PrimaryColumn() key: string = undefined!
    @Column("simple-array", { nullable: true }) selectedFiles: string[] = undefined!
    @Column("varchar", { nullable: true }) @Index() tmdbKey: string = undefined!
    @Column("varchar", { nullable: true }) episodeKey: string = undefined!
    @Column("boolean", { nullable: true }) watched: boolean = undefined!
    @Column("varchar", { nullable: true }) lastKnownPath: string = undefined!
    @Column("varchar", { nullable: true }) modified: string = undefined!
    @Column("varchar", { nullable: true }) scanned: string = undefined!
}

@Entity()
export class FsEntry {
    @PrimaryColumn() key: string = undefined!
    @Column("varchar", { nullable: true }) @Index() basename: string = undefined!
    @Column("varchar", { nullable: true }) dirname: string = undefined!
    @Column("varchar", { nullable: true }) extname: string = undefined!
    @Column("varchar", { nullable: true }) type: string = undefined!
    @Column("varchar", { nullable: true }) atime: string = undefined!
    @Column("varchar", { nullable: true }) mtime: string = undefined!
    @Column("varchar", { nullable: true }) ctime: string = undefined!
    @Column("boolean", { nullable: true }) exists: boolean = undefined!
}

@Entity()
export class KeyValue {
    @PrimaryColumn() key: string = undefined!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Column("varchar", { nullable: true }) value: any = undefined!
}

export class Db {
    constructor(public connection: Connection) {}
    static async create(database: string): Promise<Db> {
        console.log("db dir", database)
        const connectionOptions: ConnectionOptions = {
            type: "sqlite",
            database,
            // subscribers: [EverythingSubscriber],
            entities: [ByFilename, KeyValue, FsEntry],
            synchronize: true,
            //logging: {  logQueries: false, }
        }

        const connection = await createConnection(connectionOptions)
        return new Db(connection)
        //this.connection.logger.logQuery = (a, b) => console.log(a.substr(0, 1000));
        //this.connection.logger.logFailedQuery = (a, b) => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.logQueryError = a => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.log = (a, b) => { }; //console.log({ a: a.substr(0, 1000), b });
    }
    get byFilename(): Repository<ByFilename> {
        return this.connection.getRepository(ByFilename)
    }
    get keyValue(): Repository<KeyValue> {
        return this.connection.getRepository(KeyValue)
    }
    get fsEntries(): Repository<FsEntry> {
        return this.connection.getRepository(FsEntry)
    }
}
