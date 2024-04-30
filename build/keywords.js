"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.Keywords = void 0;
var Keywords;
(function (Keywords) {
    Keywords["Str"] = "@str";
    Keywords["Num"] = "@num";
    Keywords["Yes"] = "@yes";
    Keywords["No"] = "@no";
})(Keywords || (exports.Keywords = Keywords = {}));
exports.KEYWORDS = {
    "@str": /^[a-zA-Z]+$/,
    "@num": /^[0-9]+$/,
    "@yes": /^(yes|да|true|1)$/i,
    "@no": /^(no|не|false|0)$/i,
};
