import "reflect-metadata";
import { Table, Column, PrimaryGeneratedColumn, PrimaryColumn, Connection, ConnectionOptions, createConnection, Repository, } from "typeorm";
import { ColumnTypes as CT } from "typeorm/metadata/types/ColumnTypes";
import * as path from "path";
import { ByFilename as ByFilenameContract } from "contracts"


@Table()
export class ByFilename implements ByFilenameContract {
    @PrimaryColumn() key: string;
    @Column(CT.SIMPLE_ARRAY, { nullable: true }) selectedFiles: string[];
    @Column(CT.STRING, { nullable: true }) tmdbKey: string;
    @Column(CT.STRING, { nullable: true }) episodeKey: string;
    @Column(CT.STRING, { nullable: true }) watched: boolean;
    @Column(CT.STRING, { nullable: true }) lastKnownPath: string;

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
        entities: [ByFilename, KeyValue],
        autoSchemaSync: true,
        logging: {
            logQueries: false
        }
    };
    init(): Promise<any> {
        return createConnection(this.connectionOptions).then(connection => this.connection = connection);
    }
    get byFilename(): Repository<ByFilename> { return this.connection && this.connection.getRepository(ByFilename); }
    get keyValue(): Repository<KeyValue> { return this.connection && this.connection.getRepository(KeyValue); }
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
