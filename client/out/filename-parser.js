"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilenameParser = (function () {
    function FilenameParser() {
    }
    FilenameParser.prototype.parse = function (name) {
        var _this = this;
        if (name == null || name == "")
            return null;
        var x = { episode: null, name: null, season: null, tags: [], year: null, filename: name, date: null };
        var tokens = name.split(/[\. ]/);
        if (tokens.length == 1)
            return x;
        var tokens2 = tokens.map(function (token) { return _this.parseToken(token); });
        var yearToken = tokens2.first(function (t) { return t.type == "year"; });
        var seToken = tokens2.first(function (t) { return t.type == "seasonEpisode"; });
        var index = tokens2.findIndex(function (t) { return t.type == "tag" && t.braces == null; });
        var nameTokens = tokens2.skip(index).takeWhile(function (t) { return t.type == "tag" && t.braces == null; });
        if (nameTokens.length > 0)
            x.name = nameTokens.map(function (t) { return t.value; }).join(" ");
        if (yearToken != null) {
            x.year = yearToken.value;
            var uints = tokens2.skip(tokens2.indexOf(yearToken) + 1).takeWhile(function (t) { return t.type == "uint"; });
            if (uints.length >= 2 && uints.take(2).every(function (t) { return t.value <= 31; })) {
                var dateString = x.year + "-" + uints[0].value.toString().padLeft(2, '0') + "-" + uints[1].value.toString().padLeft(2, '0');
                var date = Date.tryParseExact(dateString, "yyyy-MM-dd");
                if (date != null)
                    x.date = date.format("yyyy-MM-dd");
            }
        }
        if (seToken != null) {
            x.season = seToken.value.season;
            x.episode = seToken.value.episode;
        }
        x.tags = tokens2.where(function (t) { return t.type == "tag" && !nameTokens.contains(t); }).map(function (t) { return t.value; });
        return x;
    };
    FilenameParser.prototype.parseToken = function (token) {
        if (/^\[.+\]$/.test(token) || /^\(.+\)$/.test(token)) {
            var s = token.substr(1, token.length - 2);
            var x = this.parseToken(s);
            x.braces = token.substr(0, 1) + token.substr(token.length - 1);
            x.type = x.type;
            return x;
        }
        var year = this.tryYear(token);
        var se = this.trySeasonEpisode(token);
        if (year != null) {
            return {
                type: "year",
                text: token,
                value: year,
            };
        }
        else if (se != null) {
            return {
                type: "seasonEpisode",
                text: token,
                value: se,
            };
        }
        var uint = this.tryUInt(token);
        if (uint != null) {
            return {
                type: "uint",
                text: token,
                value: uint,
            };
        }
        var t = {
            type: "tag",
            text: token,
            value: token,
        };
        return t;
    };
    FilenameParser.prototype.tryUInt = function (token) {
        if (!/^[0-9]+$/.test(token))
            return null;
        return parseInt(token);
    };
    FilenameParser.prototype.tryYear = function (token) {
        if (!/[0-9][0-9][0-9][0-9]/.test(token))
            return null;
        var x = parseInt(token);
        if (x > 1800 && x < 3000)
            return x;
        return null;
    };
    FilenameParser.prototype.trySeasonEpisode = function (token) {
        if (token.length > 6)
            return null;
        var tests = [
            /[sS]([0-9][0-9])[eE]([0-9][0-9])+/,
            /[sS]([0-9][0-9])/,
            /([0-9])x([0-9])+/,
        ];
        for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
            var test = tests_1[_i];
            if (test.test(token)) {
                var list = test.exec(token);
                return { season: parseInt(list[1]), episode: parseInt(list[2]) };
            }
        }
        return null;
    };
    return FilenameParser;
}());
exports.FilenameParser = FilenameParser;
//# sourceMappingURL=filename-parser.js.map