import { HasKey, ListFilesRequest, ListFilesResponse, File, FileRelativesInfo, PathRequest, IEnumerable, IOrderedEnumerable, } from "contracts"
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
import { FindManyOptions, Repository } from "typeorm"
import { DbService } from "./db-service"
import * as C from "contracts"

export class ByFilenameService extends DbService<ByFilename> {
    constructor(public db: Db) { super(); }
    async init(): Promise<any> {
        console.log("ByFilenameService init");
        this.repo = this.db.byFilename;
    }
}
