import "../../lib/corex/corex"
import { FileScanner } from "../utils/file-scanner"

class Test {
    videoExts = [".mkv", ".avi", ".ts", ".mpeg", ".mp4", ".mpg"];
    isVideoFile(name: string): boolean {
        return this.videoExts.first(t => name.endsWith(t)) != null;
    }

    test2() {
        let x = new FileScanner();
        let dirs = [
            "//DESKTOP-P6FV9GO/Download",
            "//DESKTOP-P6FV9GO/Download2",
            "//DESKTOP-P6FV9GO/Download3",
        ];
        x.onDir = async e => {
            return true;
        };
        x.onDirChild = async e => {
            if (!this.isVideoFile(e.child))
                return;
            console.log(e.child);
        };
        x.scan(dirs).then(() => console.log("FINISHED"));
        setTimeout(() => x.pause(), 1000);
        setTimeout(() => x.resume(), 2000);
        setTimeout(() => x.pause(), 3000);
        setTimeout(() => x.resume(), 4000);
    }
}
new Test().test2();

    //pause() {
    //    if (this._pause != null)
    //        return;
    //    this._pause = new Promise<T>((resolve, reject) => {
    //        this._resolve = resolve;
    //        this._reject = reject;
    //    });
    //}
    //resume() {
    //    if (this._resolve == null)
    //        return;
    //    let resolve = this._resolve;
    //    this._resolve = null;
    //    this._reject == null;
    //    resolve();
    //}
    //_pause: Promise<T>;
    //_resolve: (value?: T | PromiseLike<T>) => void;
    //_reject: (reason?: any) => void;
    //waitForResume(): Promise<any> {
    //    if (this._pause != null)
    //        return this._pause;
    //    return Promise.resolve();
    //}
//export function* scan(startDir: string): Iterable<ScanItem> {
//    let stack: string[] = [];
//    stack.push(startDir);
//    while (stack.length > 0) {
//        let dir = stack.pop();
//        try {
//            let children = fs.readdirSync(dir);
//            var x = yield { dir, children };
//            for (let child of children) {
//                let childPath = path.join(dir, child);
//                try {
//                    let stat = fs.statSync(childPath);
//                    if (!stat.isDirectory())
//                        continue;
//                }
//                catch (e) {
//                    continue;
//                }
//                stack.push(childPath);
//            }
//        }
//        catch (e) {
//            continue;
//        }
//    }
//}
//function test() {
//    let i = 0;
//    for (let x of scan("C:\\")) {
//        if (i > 1000000)
//            return;
//        if (i % 10000 == 0)
//            console.log(i, x.dir);
//        i++;
//    }
//}
