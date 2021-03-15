import * as C from "contracts"
import * as path from "path"
import "reflect-metadata"
import {
    Column,
    Connection,
    ConnectionOptions,
    createConnection,
    Entity,
    EntitySubscriberInterface,
    EventSubscriber,
    Index,
    PrimaryColumn,
    Repository,
} from "typeorm"

@Entity()
export class ByFilename implements C.ByFilename {
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
export class FsEntry implements C.FsEntry {
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
    @Column("varchar", { nullable: true }) value: any = undefined!
}

export class Db {
    constructor(public connection: Connection) {}
    static async create(): Promise<Db> {
        const connectionOptions: ConnectionOptions = {
            type: "sqlite",
            database: path.join(__dirname, "../../db.sqlite"),
            subscribers: [EverythingSubscriber],
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

@EventSubscriber()
export class EverythingSubscriber implements EntitySubscriberInterface<any> {
    //function test() {
    //    let db = new Db();
    //    db.init().then(() => {
    //        db.keyValue.findOneById("ggg").then(t=>console.log(t));
    //        //let x = new KeyValue();
    //        //x.key = "ggg";
    //        //x.value = {a:"b",c:"d"};
    //        //db.keyValue.persist(x).then(() => console.log("Done"));
    //    });
    //}
    //test();
    //beforeInsert(event: InsertEvent<any>) {
    //    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    //}
    //beforeUpdate(event: UpdateEvent<any>) {
    //    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
    //}
    //beforeRemove(event: RemoveEvent<any>) {
    //    console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    //}
    //afterInsert(event: InsertEvent<any>) {
    //    console.log(`AFTER ENTITY INSERTED: `, event.entity.key);
    //}
    //afterUpdate(event: UpdateEvent<any>) {
    //    console.log(`AFTER ENTITY UPDATED: `, event.entity.key);
    //}
    //afterRemove(event: RemoveEvent<any>) {
    //    console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity.key);
    //}
    //afterLoad(entity: any) {
    //    console.log(`AFTER ENTITY LOADED: `, entity.key);
    //}
}
