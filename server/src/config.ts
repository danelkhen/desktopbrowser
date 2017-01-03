import { File } from "contracts"
import { IoFile, IoDir, IoPath } from "./utils/io"
import * as path from "path"

export class SiteConfiguration {
    Filename: string;
    Save(): void {
        console.warn("not implemented");
        //new XmlSerializer().SerializeToFile(this, this.Filename);
    }
    SaveAs(filename: string): void {
        console.warn("not implemented");
    }
    static Load(): SiteConfiguration {
        console.warn("not implemented");
        return new SiteConfiguration();
        //var file = path.join(__dirname, "../../config.json");
        //if (!IoFile.Exists(file))
        //    return new SiteConfiguration();
        //var config = new XmlSerializer().DeserializeFromFile<SiteConfiguration>(file);
        //config.Filename = file;
        //return config;
    }
    HomePage: Page;
}


export class Page {
    Page() {
        this.Files = [];
    }
    Files: File[];
}
