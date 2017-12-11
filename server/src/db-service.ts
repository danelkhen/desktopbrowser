import { HasKey, ListFilesRequest, ListFilesResponse, File, FileRelativesInfo, PathRequest, IEnumerable, IOrderedEnumerable, } from "contracts"
import * as C from "contracts"

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
import { FindOneOptions, FindManyOptions, Repository } from "typeorm"


export class DbService<T> implements C.DbService<T> {
    db: Db;
    repo: Repository<T>;
    findOneById(req: { id: any, options?: FindOneOptions<T> }): Promise<T | undefined> {
        return this.repo.findOneById(req.id, req.options);
    }

    async find(req: FindManyOptions<T>): Promise<T[]> {
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
    _idPropName: string;
    getIdPropName() {
        if (this._idPropName == null) {
            let md = this.db.connection.getMetadata(this.repo.target);
            this._idPropName = md.primaryColumns[0].propertyName;
        }
        return this._idPropName;
    }
    async persist(obj: T): Promise<T> {
        let id = obj[this.getIdPropName()];
        if (id != null) {
            let obj2 = await this.repo.findOneById(id)
            if (obj2 == null)
                return this.repo.manager.save(obj);
            let final = this.repo.merge(obj2, obj as any);
            return await this.repo.manager.save(final);
        }
        return await this.repo.manager.save(obj);
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

