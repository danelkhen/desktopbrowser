import "reflect-metadata";
import { Entity, Column, Index, PrimaryGeneratedColumn, PrimaryColumn, Connection, ConnectionOptions, createConnection, Repository, ColumnType as CT } from "typeorm";
import * as path from "path";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, } from "typeorm";
import * as C from "contracts"


@Entity()
export class ByFilename implements C.ByFilename {
    @PrimaryColumn() key: string;
    @Column("simple-array", { nullable: true }) selectedFiles: string[];
    @Column("varchar", { nullable: true }) @Index() tmdbKey: string;
    @Column("varchar", { nullable: true }) episodeKey: string;
    @Column("boolean", { nullable: true }) watched: boolean;
    @Column("varchar", { nullable: true }) lastKnownPath: string;
    @Column("varchar", { nullable: true }) modified: string;
    @Column("varchar", { nullable: true }) scanned: string;
}

@Entity()
export class FsEntry implements C.FsEntry {
    @PrimaryColumn() key: string;
    @Column("varchar", { nullable: true }) @Index() basename: string;
    @Column("varchar", { nullable: true }) dirname: string;
    @Column("varchar", { nullable: true }) extname: string;
    @Column("varchar", { nullable: true }) type: string;
    @Column("varchar", { nullable: true }) atime: string;
    @Column("varchar", { nullable: true }) mtime: string;
    @Column("varchar", { nullable: true }) ctime: string;
    @Column("boolean", { nullable: true }) exists: boolean;
}

@Entity()
export class KeyValue {
    @PrimaryColumn() key: string;
    @Column("varchar", { nullable: true }) value: any;
}

export class Db {
    connection: Connection;
    connectionOptions: ConnectionOptions = {
        //driver: {
        type: "sqlite",
        database: path.join(__dirname, "../../db.sqlite"),
        //},
        subscribers: [EverythingSubscriber],
        entities: [ByFilename, KeyValue, FsEntry],
        synchronize: true,
        //logging: {  logQueries: false, }
    };
    async init(): Promise<any> {
        this.connection = await createConnection(this.connectionOptions);
        //this.connection.logger.logQuery = (a, b) => console.log(a.substr(0, 1000));
        //this.connection.logger.logFailedQuery = (a, b) => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.logQueryError = a => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.log = (a, b) => { }; //console.log({ a: a.substr(0, 1000), b });
    }
    get byFilename(): Repository<ByFilename> { return this.connection && this.connection.getRepository(ByFilename); }
    get keyValue(): Repository<KeyValue> { return this.connection && this.connection.getRepository(KeyValue); }
    get fsEntries(): Repository<FsEntry> { return this.connection && this.connection.getRepository(FsEntry); }
}

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


@EventSubscriber()
export class EverythingSubscriber implements EntitySubscriberInterface<any> {
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