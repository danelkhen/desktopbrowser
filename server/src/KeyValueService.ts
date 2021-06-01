import * as C from "../../shared/src/contracts"
import { HasKey } from "../../shared/src/contracts"
import { FindOneOptions } from "typeorm"
import { Db, KeyValue } from "./db"
import { DbService } from "./DbService"

export class KeyValueService implements C.KeyValueService {
    constructor(public db: Db) {
        this.dbService = new DbService<KeyValue>(db, db.keyValue)
    }

    dbService: DbService<KeyValue>

    toKeyValue<T extends HasKey>(obj: T): KeyValue {
        let key = obj.key
        let value: any = {}
        Object.assign(value, obj)
        delete value.key
        let x = new KeyValue()
        x.key = key
        x.value = value
        return x
    }
    fromKeyValue<T extends HasKey>(kv: KeyValue): T {
        if (kv == null) return null!
        let obj: T = kv.value
        obj.key = kv.key
        return obj
    }
    async findOneById<T>(req: { id: any; options?: FindOneOptions<C.KeyValue<T>> }): Promise<C.KeyValue<T>> {
        const res = await this.dbService.findOneById(req)
        return res!
    }
    findAllWithKeyLike<T>(req: { like: string }): Promise<C.KeyValue<T>[]> {
        return this.dbService.repo.createQueryBuilder("kv").where("kv.key like :x", { x: req.like }).getMany() //.then(list => list.map(t => this.fromKeyValue<T>(t)));
    }

    // copyOverwrite<T>(src: T, target: T): T {
    //     return Q.copy(src, target, { overwrite: true });
    // }
    async persist<T>(obj: C.KeyValue<T>): Promise<C.KeyValue<T>> {
        let obj2 = await this.findOneById({ id: obj.key })
        if (obj2 != null) obj2 = { ...obj2, ...obj }
        //this.copyOverwrite(obj.value, obj2.value);
        else obj2 = obj
        //let kv = this.toKeyValue(obj2);
        return this.dbService.repo.manager.save(obj2 as any) //.then(t => this.fromKeyValue<T>(t));
    }
}
