import { FindRequest, HasKey, KeyValueService as KeyValueServiceContract, ListFilesRequest, ListFilesResponse, File, FileRelativesInfo, PathRequest, IEnumerable, IOrderedEnumerable, DbService as DbServiceContract, ByFilename as ByFilenameContract, FileService as FileServiceContract, } from "contracts"
import { PathInfo } from "./utils/path-info"
import { SiteConfiguration, Page } from "./config"
import * as fs from "fs";
import { IoFile, IoDir, IoPath, DriveInfo, FileSystemInfo, FileAttributes, } from "./utils/io"
import * as child_process from "child_process"
import * as omdb from 'imdb-api';
//import XMLHttpRequest = require('xhr2');
import * as rimraf from "rimraf";
import * as trash from 'trash';
import * as path from "path";
//import { KeyValueStorage, Bucket } from "./db";
import * as os from "os";
import { Db, ByFilename, KeyValue } from "./db";
import { FindOptions, Repository } from "typeorm"


export class DbService<T> implements DbServiceContract<T> {
    db: Db;
    repo: Repository<T>;
    findOneById(req: { id: any, options?: FindOptions }): Promise<T | undefined> {
        return this.repo.findOneById(req.id, req.options);
    }
    find(req: FindRequest): Promise<T[]> {
        return this.repo.find(req.conditions, req.options);
    }
    _idPropName: string;
    getIdPropName() {
        if (this._idPropName == null) {
            let md = this.db.connection.getMetadata(this.repo.target);
            this._idPropName = md.primaryColumn.propertyName;
        }
        return this._idPropName;
    }
    async persist(obj: T): Promise<T> {
        let id = obj[this.getIdPropName()];
        if (id != null) {
            let obj2 = await this.repo.findOneById(id)
            if (obj2 == null)
                return this.repo.persist(obj);
            let final = this.repo.merge(obj2, obj);
            return await this.repo.persist(final);
        }
        return await this.repo.persist(obj);
    }

    async removeById(req: { id: any }): Promise<T> {
        let x = await this.repo.findOneById(req.id)
        if (x == null)
            return null;
        return await this.repo.remove(x);
    }
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

