"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path = require("path");
const typeorm_2 = require("typeorm");
let ByFilename = class ByFilename {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], ByFilename.prototype, "key", void 0);
__decorate([
    typeorm_1.Column("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], ByFilename.prototype, "selectedFiles", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }), typeorm_1.Index(),
    __metadata("design:type", String)
], ByFilename.prototype, "tmdbKey", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], ByFilename.prototype, "episodeKey", void 0);
__decorate([
    typeorm_1.Column("boolean", { nullable: true }),
    __metadata("design:type", Boolean)
], ByFilename.prototype, "watched", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], ByFilename.prototype, "lastKnownPath", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], ByFilename.prototype, "modified", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], ByFilename.prototype, "scanned", void 0);
ByFilename = __decorate([
    typeorm_1.Entity()
], ByFilename);
exports.ByFilename = ByFilename;
let FsEntry = class FsEntry {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], FsEntry.prototype, "key", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }), typeorm_1.Index(),
    __metadata("design:type", String)
], FsEntry.prototype, "basename", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "dirname", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "extname", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "type", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "atime", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "mtime", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], FsEntry.prototype, "ctime", void 0);
__decorate([
    typeorm_1.Column("boolean", { nullable: true }),
    __metadata("design:type", Boolean)
], FsEntry.prototype, "exists", void 0);
FsEntry = __decorate([
    typeorm_1.Entity()
], FsEntry);
exports.FsEntry = FsEntry;
let KeyValue = class KeyValue {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], KeyValue.prototype, "key", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", Object)
], KeyValue.prototype, "value", void 0);
KeyValue = __decorate([
    typeorm_1.Entity()
], KeyValue);
exports.KeyValue = KeyValue;
class Db {
    constructor() {
        this.connectionOptions = {
            //driver: {
            type: "sqlite",
            database: path.join(__dirname, "../../db.sqlite"),
            //},
            subscribers: [EverythingSubscriber],
            entities: [ByFilename, KeyValue, FsEntry],
            synchronize: true,
        };
    }
    async init() {
        this.connection = await typeorm_1.createConnection(this.connectionOptions);
        //this.connection.logger.logQuery = (a, b) => console.log(a.substr(0, 1000));
        //this.connection.logger.logFailedQuery = (a, b) => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.logQueryError = a => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.log = (a, b) => { }; //console.log({ a: a.substr(0, 1000), b });
    }
    get byFilename() { return this.connection && this.connection.getRepository(ByFilename); }
    get keyValue() { return this.connection && this.connection.getRepository(KeyValue); }
    get fsEntries() { return this.connection && this.connection.getRepository(FsEntry); }
}
exports.Db = Db;
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
let EverythingSubscriber = class EverythingSubscriber {
};
EverythingSubscriber = __decorate([
    typeorm_2.EventSubscriber()
], EverythingSubscriber);
exports.EverythingSubscriber = EverythingSubscriber;
