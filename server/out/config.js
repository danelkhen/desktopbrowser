"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SiteConfiguration {
    Save() {
        console.warn("not implemented");
        //new XmlSerializer().SerializeToFile(this, this.Filename);
    }
    SaveAs(filename) {
        console.warn("not implemented");
    }
    static Load() {
        console.warn("not implemented");
        return new SiteConfiguration();
        //var file = path.join(__dirname, "../../config.json");
        //if (!IoFile.Exists(file))
        //    return new SiteConfiguration();
        //var config = new XmlSerializer().DeserializeFromFile<SiteConfiguration>(file);
        //config.Filename = file;
        //return config;
    }
}
exports.SiteConfiguration = SiteConfiguration;
class Page {
    Page() {
        this.Files = [];
    }
}
exports.Page = Page;
