"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const db_service_1 = require("./db-service");
class KeyValueService {
    constructor(db) {
        this.db = db;
    }
    init() {
        this.dbService = new db_service_1.DbService();
        this.dbService.db = this.db;
        this.dbService.repo = this.dbService.db.keyValue;
    }
    toKeyValue(obj) {
        let key = obj.key;
        let value = {};
        Object.assign(value, obj);
        delete value.key;
        let x = new db_1.KeyValue();
        x.key = key;
        x.value = value;
        return x;
    }
    fromKeyValue(kv) {
        if (kv == null)
            return null;
        let obj = kv.value;
        obj.key = kv.key;
        return obj;
    }
    findOneById(req) {
        return this.dbService.findOneById(req); //.then(t => this.fromKeyValue<T>(t));
    }
    findAllWithKeyLike(req) {
        return this.dbService.repo.createQueryBuilder("kv").where("kv.key like :x", { x: req.like }).getMany(); //.then(list => list.map(t => this.fromKeyValue<T>(t)));
    }
    copyOverwrite(src, target) {
        return Q.copy(src, target, { overwrite: true });
    }
    async persist(obj) {
        let obj2 = await this.findOneById({ id: obj.key });
        if (obj2 != null)
            this.copyOverwrite(obj.value, obj2.value);
        else
            obj2 = obj;
        //let kv = this.toKeyValue(obj2);
        return this.dbService.repo.manager.save(obj2); //.then(t => this.fromKeyValue<T>(t));
    }
}
exports.KeyValueService = KeyValueService;
