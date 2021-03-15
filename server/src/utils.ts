// import fs from "fs"
// import fse from "fs-extra"
// import { IncomingMessage, ServerResponse } from "http"
import moment, { Moment } from "moment"
// import Path from "path"
// import { Readable } from "stream"
// import * as tls from "tls"
// import ReadableStream = NodeJS.ReadableStream

// export const remove = Symbol("remove")
// export const itemsAre = Symbol("itemsAre")
// export const groupBy = Symbol("itemsAre")
// export const takeWhile = Symbol("takeWhile")
// export const last = Symbol("last")
// declare global {
//     interface Array<T> {
//         [remove](item: T): void
//         [itemsAre](y: T[]): boolean
//         [groupBy]<K>(keySelector: (item: T) => K): T[][]
//         [takeWhile](pred: (item: T, index?: number) => boolean): T[]
//         readonly [last]: T | undefined
//     }
// }

// Array.prototype[remove] = function<T>(this: Array<T>, item: T): void {
//     return arrayRemove(this, item)
// }
// Object.defineProperty(Array.prototype, last, {
//     get: function<T>(this: Array<T>): T | undefined {
//         const length = this.length
//         return length ? this[this.length - 1] : undefined
//     },
// })

// export const equalsIgnoreCase = Symbol("equalsIgnoreCase")
// export const removeLast = Symbol("removeLast")

// declare global {
//     interface String {
//         [equalsIgnoreCase](s: string): boolean
//         [removeLast](x?: number): string
//     }
// }
// String.prototype[equalsIgnoreCase] = function(this: string, s: string): boolean {
//     let x: string = this
//     let xx = x.localeCompare(s, [], { sensitivity: "base" }) == 0
//     return xx
// }
// String.prototype[removeLast] = function(this: string, x?: number): string {
//     let s: string = this
//     if (x == null) x = 1
//     return s.substr(0, s.length - x)
// }

// //import * as moment from "moment"
// //import mailgun = require("mailgun-js");

// // String.prototype.startsWith = function(prefix): boolean {
// //     return this.indexOf(prefix) == 0;
// // };
// // String.prototype.endsWith = function(suffix: string): boolean {
// //     return this.indexOf(suffix, this.length - suffix.length) !== -1;
// // };
// // String.prototype.contains = function(find): boolean {
// //     return this.indexOf(find) >= 0;
// // };
// // String.prototype.replaceAll = function(find: string, replace: string): string {
// //     let find2 = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
// //     return this.replace(new RegExp(find2, "g"), replace);
// // };
// // Array.prototype.clear = function<T>(this: Array<T>): void {
// //     this.splice(0, this.length);
// // };
// // Array.prototype.contains = function<T>(this: Array<T>, item: T): boolean {
// //     return this.indexOf(item) >= 0;
// // };
// // declare global {
// //     interface Array<T> {
// //         clear(): void
// //         contains(item: T): boolean
// //     }
// // }

// // maintain recent log in memory to support reflecting it to sandbox polls
// let LOG_HISTORY = 1000
// export let logstart = 0
// export let logtrace: string[] = []

// // log to disk file and in-memory (see above)
// //TODO: consider recycling the log as it may fill the disk at some point
// export function log(s: string) {
//     let timed = new Date().toISOString() + "\t" + s
//     console.log(timed)
//     fs.appendFile("./opencode.log", timed + "\n", function(err) {
//         if (err) {
//             return console.log("failed to write to log: " + err)
//         }
//     })
//     logtrace.push(timed)
//     if (logtrace.length > LOG_HISTORY) {
//         logstart += logtrace.length - LOG_HISTORY
//         logtrace.splice(0, logtrace.length - LOG_HISTORY)
//     }
// }

// function copyFile(source: string | Buffer, target: string | Buffer, cb: (err?: string) => void) {
//     let cbCalled = false

//     let rd = fs.createReadStream(source)
//     rd.on("error", function(err: any) {
//         done(err)
//     })
//     let wr = fs.createWriteStream(target)
//     wr.on("error", function(err: any) {
//         done(err)
//     })
//     wr.on("close", function(ex: any) {
//         done()
//     })
//     rd.pipe(wr)

//     function done(err?: any) {
//         if (!cbCalled) {
//             cb(err)
//             cbCalled = true
//         }
//     }
// }

// export async function copyFileAsync(source: string | Buffer, target: string | Buffer) {
//     return new Promise((resolve, reject) =>
//         copyFile(source, target, err => {
//             if (err) reject(err)
//             else resolve()
//         })
//     )
// }

// let mimeTypes = {
//     html: "text/html",
//     txt: "text/plain",
//     js: "application/javascript",
//     png: "image/png",
//     jpg: "image/jpg",
//     gif: "image/gif",
//     css: "text/css",
//     json: "application/json",
//     eot: "application/vnd.ms-fontobject",
//     woff: "application/x-font-woff",
//     ttf: "application/x-font-ttf",
//     svg: "image/svg+xml",
//     mp4: "video/mp4",
//     pdf: "application/pdf",
//     ico: "image/x-icon",
// }

// export function getContentType(resourcepath: string): string {
//     let ext = Path.extname(resourcepath).substr(1)
//     if (ext.indexOf("#") >= 0) ext = ext.substr(0, ext.indexOf("#"))
//     let contentType = (mimeTypes as any)[ext]
//     return contentType
// }

// // read local resource file and write to response
// // stream video files through HTTP range requests so playback starts sooner
// export async function writeResourceFile(
//     resp: ServerResponse,
//     resourcepath: string,
//     opts?: { contentType?: string }
// ): Promise<boolean> {
//     if (opts == null) opts = {}
//     let contentType = opts.contentType || getContentType(resourcepath) // contenttypes[ext];
//     if (contentType == null) return false
//     let filepath = resourcepath //("." + resourcepath);
//     // without HTTP header range return the entire file
//     //return res.sendStatus(416); // 416 Wrong range
//     try {
//         let data = await fse.readFile(filepath, "binary")
//         console.log("writing " + data.length + " bytes")
//         resp.statusCode = 200
//         resp.setHeader("Content-Type", contentType)
//         resp.end(data, "binary")
//     } catch (err) {
//         resp.statusCode = 400
//         resp.statusMessage = err
//         resp.end()
//     }
//     return true
// }

// /** Copies a stream from src to dest, resolves when copy finishes, rejects on any error */
// export async function copyStream(src: NodeJS.ReadableStream, dest: NodeJS.WritableStream): Promise<void> {
//     return new Promise((resolve, reject) => {
//         src.on("error", reason => {
//             log("copyStream src stream error " + reason)
//             reject(reason)
//         })
//         dest.on("error", reason => {
//             log("copyStream dest stream error " + reason)
//             reject(reason)
//         })
//         src.on("end", () => {
//             //log("copyStream src stream end");
//             resolve()
//         })
//         src.pipe(dest)
//     })
// }

// export async function readStreamToEnd(src: NodeJS.ReadableStream): Promise<string[]> {
//     return new Promise<string[]>((resolve, reject) => {
//         let sb: string[] = []
//         src.on("error", reject)
//         src.on("data", data => sb.push(data))
//         src.on("end", () => resolve(sb))
//     })
// }

// export function isReadableStream(x: any): x is NodeJS.ReadableStream {
//     return x instanceof Readable
// }

// export function sleep(ms?: number): Promise<void> {
//     return new Promise((resolve, reject) => global.setTimeout(resolve, ms || 0))
// }

// export async function time(action: () => any): Promise<number> {
//     let start = process.hrtime()
//     await action()
//     let end = process.hrtime(start)
//     return end[0] / 1000 + end[1] / 1000000
// }

// //export function now(): string {
// //    return moment().format("YYYY-MM-DD HH:mm:ss");
// //}

// export function watchForNextChange(file: string): Promise<{ event: string; filename: string }> {
//     return new Promise((resolve, reject) => {
//         let watcher = fse.watch(file, (event, filename) => {
//             watcher.close()
//             resolve({ event, filename })
//         })
//     })
// }

// export function getBaseUrl(req: IncomingMessage): string {
//     let host = getHost(req)
//     let protocol = getProtocol(req)
//     return `${protocol}://${host}`
// }
// export function getHost(req: IncomingMessage): string {
//     return (req.headers.host as string) || ""
// }
// /**
//  * load balancer headers when lb unwraps ssl
//   'x-forwarded-for: 5.57.21.49',
//   'x-forwarded-port: 443',
//   'x-forwarded-proto: https' ]
//  * @param req
//  */
// export function getProtocol(req: IncomingMessage): "http" | "https" {
//     let proto = req.headers["x-forwarded-proto"] as string
//     if (proto != null) return proto as any
//     let conn = req.connection as tls.TLSSocket
//     return conn.encrypted ? "https" : "http"
// }

// export function getFullUrl(req: IncomingMessage): string {
//     return getBaseUrl(req) + req.url
// }

// export class Response implements ResponseArgs {
//     constructor(args?: ResponseArgs) {
//         if (args == null) return
//         Object.assign(this, args)
//     }
//     statusCode: number = undefined!
//     statusMessage: string = undefined!
//     contentType: string = undefined!
//     content: ReadableStream | Buffer | string | number | boolean | object = undefined!
//     handle: (req: IncomingMessage, resp: ServerResponse) => Promise<void> = undefined!
//     headers: any
//     redirectTo: string = undefined!
//     leaveUnfinished: boolean = undefined!
// }
// export interface ResponseArgs {
//     statusCode?: number
//     statusMessage?: string
//     contentType?: string
//     content?: ReadableStream | string | number | boolean | object
//     handle?: (req: IncomingMessage, resp: ServerResponse) => Promise<void>
//     redirectTo?: string
//     leaveUnfinished?: boolean
//     headers?: any
// }

// export function cached() {
//     return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         let func = target[propertyKey]
//         let first = false
//         let lastValue: any
//         descriptor.value = function() {
//             if (!first) {
//                 lastValue = func.call(this)
//                 first = true
//             }
//             return lastValue
//         }
//     }
// }
// function arrayRemove<T>(x: T[], item: T) {
//     const index = x.indexOf(item)
//     if (index < 0) return
//     x.splice(index, 1)
// }

export function objectTryGet(obj: any, indexers: string[] | string): any {
    if (typeof indexers == "string") indexers = indexers.split(".")
    var value = obj
    for (var i = 0; i < indexers.length; i++) {
        if (value == null) return null
        value = value[indexers[i]]
    }
    return value
}

// let DefaultDateFormat = "YYYY-MM-DD hh:mm:ss"

// export function toDefaultDate(s: string): Date | null {
//     return tryParseExactDate(s, DefaultDateFormat)
// }
// export function tryParseExactMoment(s: string, format: string): Moment | null {
//     const x = moment(s, format)
//     if (!x.isValid()) return null
//     return x
// }
// export function tryParseExactDate(s: string, format: string): Date | null {
//     return tryParseExactMoment(s, format)?.toDate() ?? null
// }

export function dateToDefaultString(dt: Date): string {
    let defaultDateFormat = "YYYY-MM-DD hh:mm:ss"
    return moment(dt).format(defaultDateFormat)
}
