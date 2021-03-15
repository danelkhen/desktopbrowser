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
exports.Photo = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
let Photo = class Photo {
    constructor() {
        this.id = undefined;
        this.name = undefined;
        this.description = undefined;
        this.fileName = undefined;
        this.views = undefined;
        this.isPublished = undefined;
    }
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Photo.prototype, "id", void 0);
__decorate([
    typeorm_2.Column({
        length: 500,
    }),
    __metadata("design:type", String)
], Photo.prototype, "name", void 0);
__decorate([
    typeorm_2.Column("text"),
    __metadata("design:type", String)
], Photo.prototype, "description", void 0);
__decorate([
    typeorm_2.Column(),
    __metadata("design:type", String)
], Photo.prototype, "fileName", void 0);
__decorate([
    typeorm_2.Column("int"),
    __metadata("design:type", Number)
], Photo.prototype, "views", void 0);
__decorate([
    typeorm_2.Column(),
    __metadata("design:type", Boolean)
], Photo.prototype, "isPublished", void 0);
Photo = __decorate([
    typeorm_2.Entity()
], Photo);
exports.Photo = Photo;
typeorm_1.createConnection({
    //driver: {
    type: "sqlite",
    //host: "localhost",
    //port: 3306,
    //username: "root",
    //password: "admin",
    database: "test.sqlite",
    //storage: "test.sqlite",
    //},
    entities: [Photo],
    synchronize: true,
    //autoSchemaSync: true,
})
    .then(connection => {
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.fileName = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;
    //connection.entityManager
    //    .persist(photo)
    //    .then(photo => {
    //        console.log("Photo has been saved");
    //        connection.entityManager.find(Photo).then(savedPhotos => {
    //            console.log("All photos from the db: ", savedPhotos);
    //        });
    //    });
})
    .catch(error => console.log(error));
