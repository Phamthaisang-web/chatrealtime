"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSlugify = exports.buildSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const buildSlug = (str) => {
    return (0, slugify_1.default)(str, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: 'vi', // language code of the locale to use
        trim: true // trim leading and trailing replacement chars, defaults to `true`
    });
};
exports.buildSlug = buildSlug;
const buildSlugify = (str) => {
    if (!str)
        return false;
    const utf8 = {
        'a': 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
        'd': 'đ|Đ',
        'e': 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
        'i': 'í|ì|ỉ|ĩ|ị|Í|Ì|Ỉ|Ĩ|Ị',
        'o': 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
        'u': 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
        'y': 'ý|ỳ|ỷ|ỹ|ỵ|Ý|Ỳ|Ỷ|Ỹ|Ỵ',
        '': '\\_|\\.|\\/|\\?|&|\\+|\\\\|\'|"|,',
        '-': '\\s+'
    };
    for (const ascii in utf8) {
        const regex = new RegExp(`(${utf8[ascii]})`, 'gi');
        str = str.replace(regex, ascii);
    }
    str = str.replace(/[^a-zA-Z0-9-\s]/g, ""); // Loại bỏ các ký tự không hợp lệ
    str = str.replace(/---/g, "-"); // Thay thế chuỗi "---" bằng "-"
    str = str.trim(); // Loại bỏ dấu "-" ở đầu và cuối chuỗi
    return str.toLowerCase(); // Chuyển về chữ thường
};
exports.buildSlugify = buildSlugify;
//# sourceMappingURL=slugify.helper.js.map