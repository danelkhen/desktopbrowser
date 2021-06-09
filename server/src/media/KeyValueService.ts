import { FindOneOptions } from "typeorm"
import * as C from "../../../shared/src/media"
import { LevelDbCollection } from "../LevelDb"
import { KeyValue } from "./db"
import { DbService } from "./DbService"

export class KeyValueService implements C.KeyValueService {
    constructor(public db: LevelDbCollection<C.KeyValue>) {
        this.dbService = new DbService<C.KeyValue>(db)
    }

    dbService: DbService<C.KeyValue>

    toKeyValue<T extends C.HasKey>(obj: T): KeyValue {
        let key = obj.key
        let value: any = {}
        Object.assign(value, obj)
        delete value.key
        let x = new KeyValue()
        x.key = key
        x.value = value
        return x
    }
    fromKeyValue<T extends C.HasKey>(kv: KeyValue): T {
        if (kv == null) return null!
        let obj: T = kv.value
        obj.key = kv.key
        return obj
    }
    async findOneById<T>(req: { id: any; options?: FindOneOptions<C.KeyValue<T>> }): Promise<C.KeyValue<T>> {
        const res = await this.dbService.findOneById(req)
        return res!
    }
    async findAllWithKeyLike<T>(req: { like: string }): Promise<C.KeyValue<T>[]> {
        return [] // this.dbService.repo.createQueryBuilder("kv").where("kv.key like :x", { x: req.like }).getMany() //.then(list => list.map(t => this.fromKeyValue<T>(t)));
    }

    // copyOverwrite<T>(src: T, target: T): T {
    //     return Q.copy(src, target, { overwrite: true });
    // }
    async persist<T>(obj: C.KeyValue<T>): Promise<C.KeyValue<T>> {
        throw new Error("not implemented")

        // let obj2 = await this.findOneById({ id: obj.key })
        // if (obj2 != null) obj2 = { ...obj2, ...obj }
        // //this.copyOverwrite(obj.value, obj2.value);
        // else obj2 = obj
        // //let kv = this.toKeyValue(obj2);
        // return this.dbService.repo.manager.save(obj2 as any) //.then(t => this.fromKeyValue<T>(t));
    }
}
