"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const requireDirectory = require("require-directory");
const uuid = require("uuid");
const fileExtension = path.extname(__filename).slice(1);
const options = {
    extensions: [fileExtension],
    recurse: true,
    rename: (name) => {
        return `${name}-${uuid()}`;
    },
    visit: (obj) => {
        return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj;
    }
};
class RouterFinder {
    static findAll(path) {
        const routes = requireDirectory(module, path, options);
        const map = (value) => {
            return Object.values(value).reduce((routes, value) => {
                const type = typeof value;
                switch (type) {
                    case 'function':
                        routes.push(value);
                        break;
                    case 'object':
                        routes.push(...map(value));
                        break;
                }
                return routes;
            }, []);
        };
        return map(routes);
    }
}
exports.RouterFinder = RouterFinder;
