"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbService {
    findOneById(req) {
        return this.repo.findOneById(req.id, req.options);
    }
    async find(req) {
        console.log("find", req);
        try {
            let res = await this.repo.find(req);
            return res;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    getIdPropName() {
        if (this._idPropName == null) {
            let md = this.db.connection.getMetadata(this.repo.target);
            this._idPropName = md.primaryColumns[0].propertyName;
        }
        return this._idPropName;
    }
    async persist(obj) {
        let id = obj[this.getIdPropName()];
        if (id != null) {
            let obj2 = await this.repo.findOneById(id);
            if (obj2 == null) {
                let obj3 = this.repo.create([obj])[0];
                return this.repo.manager.save(obj3);
            }
            let final = this.repo.merge(obj2, obj);
            return await this.repo.manager.save(final);
        }
        return await this.repo.manager.save(obj);
    }
    async removeById(req) {
        let x = await this.repo.findOneById(req.id);
        if (x == null)
            return null;
        return await this.repo.remove(x);
    }
}
exports.DbService = DbService;
function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
