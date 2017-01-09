import "reflect-metadata";
import { Table, Column, PrimaryGeneratedColumn, PrimaryColumn, Connection, ConnectionOptions, createConnection, Repository, } from "typeorm";
import { ColumnTypes as CT } from "typeorm/metadata/types/ColumnTypes";
import * as path from "path";
import { ByFilename as ByFilenameContract, FsEntry as FsEntryContract } from "contracts"
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, } from "typeorm";


@Table()
export class ByFilename implements ByFilenameContract {
    @PrimaryColumn() key: string;
    @Column(CT.SIMPLE_ARRAY, { nullable: true }) selectedFiles: string[];
    @Column(CT.STRING, { nullable: true }) tmdbKey: string;
    @Column(CT.STRING, { nullable: true }) episodeKey: string;
    @Column(CT.STRING, { nullable: true }) watched: boolean;
    @Column(CT.STRING, { nullable: true }) lastKnownPath: string;
    @Column(CT.STRING, { nullable: true }) modified: string;
}

@Table()
export class FsEntry implements FsEntryContract {
    @PrimaryColumn() key: string;
    @Column(CT.STRING, { nullable: true }) basename: string;
    @Column(CT.STRING, { nullable: true }) dirname: string;
    @Column(CT.STRING, { nullable: true }) extname: string;
    @Column(CT.STRING, { nullable: true }) type: string;
    @Column(CT.STRING, { nullable: true }) atime: string;
    @Column(CT.STRING, { nullable: true }) mtime: string;
    @Column(CT.STRING, { nullable: true }) ctime: string;
}

@Table()
export class KeyValue {
    @PrimaryColumn() key: string;
    @Column(CT.JSON, { nullable: true }) value: any;
}

export class Db {
    connection: Connection;
    connectionOptions: ConnectionOptions = {
        driver: {
            type: "sqlite",
            storage: path.join(__dirname, "../../db.sqlite"),
        },
        subscribers: [EverythingSubscriber],
        entities: [ByFilename, KeyValue, FsEntry],
        autoSchemaSync: true,
        logging: { logQueries: false, }
    };
    init(): Promise<any> {
        return createConnection(this.connectionOptions).then(connection => this.connection = connection);
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