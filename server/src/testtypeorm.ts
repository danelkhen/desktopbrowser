import "reflect-metadata";
import "reflect-metadata";
import { createConnection } from "typeorm";

import { Table, Column, PrimaryGeneratedColumn } from "typeorm";

@Table()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 500
    })
    name: string;

    @Column("text")
    description: string;

    @Column()
    fileName: string;

    @Column("int")
    views: number;

    @Column()
    isPublished: boolean;
}

createConnection({
    driver: {
        type: "sqlite",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin",
        database: "test",
        storage: "test.sqlite",
    },
    entities: [
        Photo
    ],
    autoSchemaSync: true,
}).then(connection => {

    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.fileName = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    connection.entityManager
        .persist(photo)
        .then(photo => {
            console.log("Photo has been saved");
            connection.entityManager.find(Photo).then(savedPhotos => {
                console.log("All photos from the db: ", savedPhotos);
            });
        });



}).catch(error => console.log(error));
