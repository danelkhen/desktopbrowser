import { FindManyOptions, FindOneOptions } from "typeorm"
import * as M from "../../../shared/src/media"
import { LevelDbCollection, LevelDbEntity } from "../LevelDb"

export class DbService<T extends LevelDbEntity> implements M.DbService<T> {
    constructor(public repo: LevelDbCollection<T>) {}

    // db: Db = undefined!
    // repo: Repository<T> = undefined!
    findOneById(req: { id: any; options?: FindOneOptions<T> }): Promise<T | undefined> {
        throw new Error("not implemented")
        // return this.repo.findOne(req.id, req.options)
    }

    async find(req: FindManyOptions<T>): Promise<T[]> {
        throw new Error("not implemented")
        // console.log("find", req)
        // try {
        //     let res = await this.repo.find(req)
        //     return res
        // } catch (e) {
        //     console.log(e)
        //     throw e
        // }
    }
    // _idPropName: string = undefined!
    getIdPropName() {
        throw new Error("not implemented")
        // if (this._idPropName == null) {
        //     let md = this.db.connection.getMetadata(this.repo.target)
        //     this._idPropName = md.primaryColumns[0].propertyName
        // }
        // return this._idPropName
    }
    async persist(obj: T): Promise<T> {
        throw new Error("not implemented")
        // let id = (obj as any)[this.getIdPropName()]
        // if (id != null) {
        //     let obj2 = await this.repo.findOne(id)
        //     if (obj2 == null) {
        //         let obj3 = this.repo.create([obj as any])[0]
        //         return this.repo.manager.save(obj3)
        //     }
        //     let final = this.repo.merge(obj2, obj as any)
        //     return await this.repo.manager.save(final)
        // }
        // return await this.repo.manager.save(obj)
    }

    async removeById(req: { id: any }): Promise<T> {
        throw new Error("not implemented")
        // let x = await this.repo.findOne(req.id)
        // if (x == null) return null!
        // return await this.repo.remove(x)
    }
}
