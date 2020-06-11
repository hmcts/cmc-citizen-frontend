"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
function pdfEndpointResponseHandler(filename, res) {
    return function (response) {
        if (response.statusCode !== HttpStatus.OK) {
            throw new Error(response.statusMessage || 'Unexpected error during document retrieval');
        }
        const buffers = [];
        response.on('data', (chunk) => {
            buffers.push(chunk);
        });
        response.on('end', () => {
            const pdf = Buffer.concat(buffers);
            res.writeHead(HttpStatus.OK, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}.pdf`,
                'Content-Length': pdf.length
            });
            res.end(pdf);
        });
    };
}
exports.pdfEndpointResponseHandler = pdfEndpointResponseHandler;
