import * as mongodb from 'mongodb';
import * as child_process from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as C from "contracts"

let server: mongodb.Server;
let mdb: mongodb.Db;
export let db: Db;
main();

async function startMongoDbServer(): Promise<mongodb.Server> {
    let dir = path.join(__dirname, "../data");
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    let proc = child_process.spawn("mongod", ["--smallfiles", "--nojournal", "--dbpath", dir], { stdio: "inherit" });
    await setTimeout2(1000);
    let server = new mongodb.Server('localhost', 27017, { /*auto_reconnect: true*/ });
    return server;
}

async function main(): Promise<any> {
    server = await startMongoDbServer();
    mdb = new mongodb.Db('mydb', server, { w: 1 });
    await mdb.open();
    db = new Db();
    db.connection = mdb;
    await db.init();
    //await test();
}


function setTimeout2(ms?: number): Promise<any> {
    return new Promise((resolve, reject) => setTimeout(resolve, ms || 0));
}


export class Db {
    connection: mongodb.Db;
    connectionOptions: mongodb.DbCreateOptions = { w: 1 };
    async init(): Promise<any> {
        if (this.connection != null)
            return;
        this.connection = new mongodb.Db('mydb', server, { w: 1 });
        await this.connection.open();
    }
    get byFilename(): Collection<C.ByFilename> { return this.connection && this.connection.collection("ByFilename"); }
    get keyValue(): Collection<C.KeyValue<any>> { return this.connection && this.connection.collection("KeyValue"); }
    get fsEntries(): Collection<C.FsEntry> { return this.connection && this.connection.collection("FsEntry"); }
}

export interface Collection<T> extends mongodb.Collection {

}


//async function test() {
//    let user: Partial<User> = { _id: "aaa", email: "ggg", first_name: "aaa" };
//    //let res = await db.collection("users").insertOne(user);
//    //console.log(res.result);
//    let x = await db.collection("users").findOne({ _id: "aaa" });
//    //let users = await getUsers();
//    console.log(x);
//}

//export interface User {
//    _id: string;
//    email: string;
//    first_name: string;
//    last_name: string;
//    fbId: number;
//    boards: Board[];
//}

//export interface Board {
//    title: string;
//    description: string;
//    images: mongodb.ObjectID[];
//}

//export interface Image {
//    _id: mongodb.ObjectID;
//    user: string;
//    caption: string;
//    imageUri: string;
//    link: string;
//    board: string;
//    comments: { text: string; user: string; }[];
//}

//export async function getUser(id: string): Promise<User> {
//    let users = await db.collection('users');
//    let user = await users.find({ _id: id }).batchSize(10).next();
//    return user;
//}

//export async function getUsers(): Promise<User[]> {
//    let users_collection = await db.collection('users');
//    let userobjs = await users_collection.find({}, { '_id': 1 }).toArray(); //function (error, userobjs) {
//    return userobjs;
//}

//export function getImage(imageId: string, callback: (image: Image) => void) {
//    db.collection('images', function (error, images_collection) {
//        if (error) { console.error(error); return; }
//        images_collection.find({ _id: new mongodb.ObjectID(imageId) }).batchSize(10).next(function (error, image) {
//            if (error) { console.error(error); return; }
//            callback(image);
//        });
//    });
//}

//export function getImages(imageIds: mongodb.ObjectID[], callback: (images: Image[]) => void) {
//    db.collection('images', function (error, images_collection) {
//        if (error) { console.error(error); return; }
//        images_collection.find({ _id: { $in: imageIds } }).toArray(function (error, images) {
//            callback(images);
//        });
//    });
//}

//export function addBoard(userid: any, title: string, description: string, callback: (user: User) => void) {
//    db.collection('users', function (error, users) {
//        if (error) { console.error(error); return; }
//        users.update(
//            { _id: userid },
//            { "$push": { boards: { title: title, description: description, images: [] } } },
//            function (error, user) {
//                if (error) { console.error(error); return; }
//                callback(user.result);
//            }
//        );
//    });
//}

//export function addPin(userid: string, boardid: string, imageUri: string, link: string, caption: string, callback: (user: User) => void) {
//    db.collection('images', function (error, images_collection) {
//        if (error) { console.error(error); return; }
//        images_collection.insert({
//            user: userid,
//            caption: caption,
//            imageUri: imageUri,
//            link: link,
//            board: boardid,
//            comments: []
//        }, function (error, image) {
//            console.log(image);
//            db.collection('users', function (error, users) {
//                if (error) { console.error(error); return; }
//                users.update(
//                    { _id: userid, "boards.title": boardid },
//                    { "$push": { "boards.$.images": image[0]._id } },
//                    function (error, user) {
//                        callback(user.result);
//                    }
//                );
//            })
//        })
//    })
//}
