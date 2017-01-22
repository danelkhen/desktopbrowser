import { FilenameParsedInfo } from "contracts";

export class FilenameParser {
    parse(name: string): FilenameParsedInfo {
        if (name == null || name == "")
            return null;
        let x: FilenameParsedInfo = { episode: null, name: null, season: null, tags: [], year: null, filename: name, date: null };
        let tokens = name.split(/[\. ]/);
        if (tokens.length == 1)
            return x;
        let tokens2 = tokens.map(token => this.parseToken(token));
        let yearToken = tokens2.first(t => t.type == "year");
        let seToken = tokens2.first(t => t.type == "seasonEpisode");
        let index = tokens2.findIndex(t => t.type == "tag" && t.braces == null);
        let nameTokens = tokens2.skip(index).takeWhile(t => t.type == "tag" && t.braces == null);
        if (nameTokens.length > 0)
            x.name = nameTokens.map(t => t.value).join(" ");
        if (yearToken != null) {
            x.year = yearToken.value;
            let uints = tokens2.skip(tokens2.indexOf(yearToken)+1).takeWhile(t => t.type == "uint");
            if (uints.length >= 2 && uints.take(2).every(t => t.value <= 31)) {
                let dateString = `${x.year}-${uints[0].value.toString().padLeft(2, '0')}-${uints[1].value.toString().padLeft(2, '0')}`;
                let date = Date.tryParseExact(dateString, "yyyy-MM-dd");
                if (date != null)
                    x.date = date.format("yyyy-MM-dd");
            }
        }
        if (seToken != null) {
            x.season = seToken.value.season;
            x.episode = seToken.value.episode;
        }
        x.tags = tokens2.where(t => t.type == "tag" && !nameTokens.contains(t)).map(t => t.value);
        return x;
    }
    parseToken(token: string): Token {
        if (/^\[.+\]$/.test(token) || /^\(.+\)$/.test(token)) {
            let s = token.substr(1, token.length - 2);
            let x = this.parseToken(s);
            x.braces = token.substr(0, 1) + token.substr(token.length - 1);
            x.type = x.type;
            return x;
        }
        let year = this.tryYear(token);
        let se = this.trySeasonEpisode(token);
        if (year != null) {
            return <Token>{
                type: "year",
                text: token,
                value: year,
            };
        }
        else if (se != null) {
            return <Token>{
                type: "seasonEpisode",
                text: token,
                value: se,
            };
        }
        let uint = this.tryUInt(token);
        if (uint != null) {
            return <Token>{
                type: "uint",
                text: token,
                value: uint,
            };
        }
        let t: Token = {
            type: "tag",
            text: token,
            value: token,
        };
        return t;
    }
    tryUInt(token: string): number {
        if (!/^[0-9]+$/.test(token))
            return null;
        return parseInt(token);
    }
    tryYear(token: string): number {
        if (!/[0-9][0-9][0-9][0-9]/.test(token))
            return null;
        let x = parseInt(token);
        if (x > 1800 && x < 3000)
            return x;
        return null;
    }
    trySeasonEpisode(token: string): { season: number, episode: number } {
        if (token.length > 6)
            return null;
        let tests: RegExp[] = [
            /[sS]([0-9][0-9])[eE]([0-9][0-9])+/,
            /[sS]([0-9][0-9])/,
            /([0-9])x([0-9])+/,
        ];
        for (let test of tests) {
            if (test.test(token)) {
                let list = test.exec(token);
                return { season: parseInt(list[1]), episode: parseInt(list[2]) };
            }
        }
        return null;
    }
}

export interface Token {
    text: string;
    type: string;
    value: any;
    braces?: string;
}

