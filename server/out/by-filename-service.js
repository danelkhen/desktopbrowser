"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = require("./db-service");
class ByFilenameService extends db_service_1.DbService {
    constructor(db) {
        super();
        this.db = db;
    }
    async init() {
        console.log("ByFilenameService init");
        this.repo = this.db.byFilename;
    }
}
exports.ByFilenameService = ByFilenameService;
