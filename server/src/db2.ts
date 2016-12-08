import "reflect-metadata";
import { Table, Column, PrimaryGeneratedColumn, PrimaryColumn, Connection, ConnectionOptions, createConnection, Repository } from "typeorm";
import { ColumnTypes } from "typeorm/metadata/types/ColumnTypes";
import * as path from "path";


@Table()
export class ByFilename {

    @PrimaryColumn()
    key: string;

    @Column(ColumnTypes.SIMPLE_ARRAY)
    selectedFiles?: string[];
}


export class Db {
    connection: Connection;
    connectionOptions: ConnectionOptions = {
        driver: {
            type: "sqlite",
            storage:  path.join(__dirname,"../../db.sqlite"),
        },
        entities: [ByFilename],
        autoSchemaSync: true,
    };
    init(): Promise<any> {
        return createConnection(this.connectionOptions).then(connection => this.connection = connection);
    }
    get byFilename(): Repository<ByFilename> { return this.connection == null ? null : this.connection.getRepository(ByFilename); }
}


function test() {
    //console.log(ColumnTypes);
    //console.log(ColumnTypes.SIMPLE_ARRAY);
    //return;
    let db = new Db();
    db.init().then(() => {
        let x = new ByFilename();
        x.key = "ggg";
        x.selectedFiles = ["aaa", "bbb", "ccc"];
        db.byFilename.persist(x).then(() => console.log("Done"));
    });
}
//test();
