"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
class DownloadUtils {
    static downloadPDF(res, content, filename) {
        res.writeHead(HttpStatus.OK, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${filename}.pdf`,
            'Content-Length': content ? content.length : 0
        });
        res.end(content);
    }
}
exports.DownloadUtils = DownloadUtils;
