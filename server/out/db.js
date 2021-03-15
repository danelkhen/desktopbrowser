"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverythingSubscriber = exports.Db = exports.KeyValue = exports.FsEntry = exports.ByFilename = void 0;
const path = __importStar(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
let ByFilename = class ByFilename {
    constructor() {
        this.key = undefined;
        this.selectedFiles = undefined;
        this.tmdbKey = undefined;
        this.episodeKey = undefined;
        this.watched = undefined;
        this.lastKnownPath = undefined;
        this.modified = undefined;
        this.scanned = undefined;
    }
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
    typeorm_1.Column("varchar", { nullable: true }),
    typeorm_1.Index(),
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
    constructor() {
        this.key = undefined;
        this.basename = undefined;
        this.dirname = undefined;
        this.extname = undefined;
        this.type = undefined;
        this.atime = undefined;
        this.mtime = undefined;
        this.ctime = undefined;
        this.exists = undefined;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], FsEntry.prototype, "key", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: true }),
    typeorm_1.Index(),
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
    constructor() {
        this.key = undefined;
        this.value = undefined;
    }
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
    constructor(connection) {
        this.connection = connection;
    }
    static async create() {
        const connectionOptions = {
            type: "sqlite",
            database: path.join(__dirname, "../../db.sqlite"),
            subscribers: [EverythingSubscriber],
            entities: [ByFilename, KeyValue, FsEntry],
            synchronize: true,
            //logging: {  logQueries: false, }
        };
        const connection = await typeorm_1.createConnection(connectionOptions);
        return new Db(connection);
        //this.connection.logger.logQuery = (a, b) => console.log(a.substr(0, 1000));
        //this.connection.logger.logFailedQuery = (a, b) => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.logQueryError = a => { }; //console.log({ a: a.substr(0, 1000) });
        //this.connection.logger.log = (a, b) => { }; //console.log({ a: a.substr(0, 1000), b });
    }
    get byFilename() {
        return this.connection.getRepository(ByFilename);
    }
    get keyValue() {
        return this.connection.getRepository(KeyValue);
    }
    get fsEntries() {
        return this.connection.getRepository(FsEntry);
    }
}
exports.Db = Db;
let EverythingSubscriber = class EverythingSubscriber {
};
EverythingSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], EverythingSubscriber);
exports.EverythingSubscriber = EverythingSubscriber;
