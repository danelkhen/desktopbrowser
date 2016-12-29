import "reflect-metadata";
import { Table, Column, PrimaryGeneratedColumn, PrimaryColumn, Connection, ConnectionOptions, createConnection, Repository, } from "typeorm";
import { ColumnTypes as CT } from "typeorm/metadata/types/ColumnTypes";
import * as path from "path";
import { Movie as MovieContract, ByFilename as ByFilenameContract } from "contracts"


@Table()
export class ByFilename implements ByFilenameContract {
    @PrimaryColumn() key: string;
    @Column(CT.SIMPLE_ARRAY, { nullable: true }) selectedFiles: string[];
    @Column(CT.STRING, { nullable: true }) tmdbId: string;
}

@Table()
export class Movie implements MovieContract {

    @PrimaryGeneratedColumn() id: string;

    @Column() imdbid: string;
    @Column() imdburl: string;
    @Column() genres: string;
    @Column() languages: string;
    @Column() country: string;
    @Column() votes: string;
    @Column() series: boolean;
    @Column() rating: number;
    @Column() runtime: string;
    @Column() title: string;
    @Column() year: number;
    @Column() type: string;
    @Column() poster: string;
    @Column() metascore: string;
    @Column() plot: string;
    @Column() rated: string;
    @Column() director: string;
    @Column() writer: string;
    @Column() actors: string;
    @Column() released: Date;
}

export class Db {
    connection: Connection;
    connectionOptions: ConnectionOptions = {
        driver: {
            type: "sqlite",
            storage: path.join(__dirname, "../../db.sqlite"),
        },
        entities: [ByFilename, Movie],
        autoSchemaSync: true,
    };
    init(): Promise<any> {
        return createConnection(this.connectionOptions).then(connection => this.connection = connection);
    }
    get byFilename(): Repository<ByFilename> { return this.connection == null ? null : this.connection.getRepository(ByFilename); }
    get movie(): Repository<Movie> { return this.connection == null ? null : this.connection.getRepository(Movie); }
}


//function test() {
//    //console.log(ColumnTypes);
//    //console.log(ColumnTypes.SIMPLE_ARRAY);
//    //return;
//    let db = new Db();
//    db.init().then(() => {
//        let x = new ByFilename();
//        x.key = "ggg";
//        x.selectedFiles = ["aaa", "bbb", "ccc"];
//        db.byFilename.persist(x).then(() => console.log("Done"));
//    });
//}
//test();
