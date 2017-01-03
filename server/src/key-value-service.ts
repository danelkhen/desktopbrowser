import { HasKey, KeyValueService as KeyValueServiceContract, ListFilesRequest, ListFilesResponse, File, FileRelativesInfo, PathRequest, IEnumerable, IOrderedEnumerable, DbService as DbServiceContract, ByFilename as ByFilenameContract, FileService as FileServiceContract,  } from "contracts"
import { PathInfo } from "./utils/path-info"
import { SiteConfiguration, Page } from "./config"
import * as fs from "fs";
import { IoFile, IoDir, IoPath, DriveInfo, FileSystemInfo,  } from "./utils/io"
import * as child_process from "child_process"
import * as omdb from 'imdb-api';
import XMLHttpRequest = require('xhr2');
import * as rimraf from "rimraf";
import * as trash from 'trash';
import * as path from "path";
import * as os from "os";
import { Db, ByFilename, KeyValue } from "./db2";
import { FindOptions, Repository } from "typeorm"
import { DbService } from "./service"


export class KeyValueService implements KeyValueServiceContract {
    dbService: DbService<KeyValue>;

    init(): Promise<any> {
        this.dbService = new DbService<KeyValue>();
        this.dbService.db = new Db();
        return this.dbService.db.init().then(() => this.dbService.repo = this.dbService.db.keyValue);
    }
    toKeyValue<T extends HasKey>(obj: T): KeyValue {
        let key = obj.key;
        let value: any = {};
        Object.assign(value, obj);
        delete value.key;
        let x = new KeyValue();
        x.key = key;
        x.value = value;
        return x;
    }
    fromKeyValue<T extends HasKey>(kv: KeyValue): T {
        if (kv == null)
            return null;
        let obj: T = kv.value;
        obj.key = kv.key;
        return obj;
    }
    findOneById<T extends HasKey>(req: { id: any, options?: FindOptions }): Promise<T | undefined> {
        return this.dbService.findOneById(req).then(t => this.fromKeyValue<T>(t));
    }
    findAllWithKeyLike<T extends HasKey>(req: { like: string }): Promise<T[]> {
        return this.dbService.repo.createQueryBuilder("kv").where("kv.key like :x", { x: req.like }).getMany().then(list => list.map(t => this.fromKeyValue<T>(t)));
    }


    copyOverwrite<T>(src: T, target: T): T {
        return Q.copy(src, target, { overwrite: true });
    }
    persist<T extends HasKey>(obj: T): Promise<any> {
        return this.findOneById({ id: obj.key }).then(obj2 => {
            if (obj2 != null)
                this.copyOverwrite(obj, obj2);
            else
                obj2 = obj;
            let kv = this.toKeyValue(obj2);
            return this.dbService.repo.persist(kv).then(t => this.fromKeyValue<T>(t));
        });
    }
}

