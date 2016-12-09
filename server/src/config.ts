import { File } from "contracts"
import { IoFile, IoDir, IoPath } from "./utils/io"
import { HttpContext } from "./utils/http-context"

export class SiteConfiguration {
    Filename: string;
    Save(): void {
        new XmlSerializer().SerializeToFile(this, this.Filename);
    }
    SaveAs(filename: string): void {
        new XmlSerializer().SerializeToFile(this, filename);
    }
    static Load(): SiteConfiguration {
        var file = HttpContext.Current.MapPath("~/SiteConfiguration.xml");
        if (!IoFile.Exists(file))
            return new SiteConfiguration();
        var config = new XmlSerializer().DeserializeFromFile<SiteConfiguration>(file);
        config.Filename = file;
        return config;
    }
    HomePage: Page;
}


export class Page {
    Page() {
        this.Files = [];
    }
    Files: File[];
}
