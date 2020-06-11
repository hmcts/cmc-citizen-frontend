"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequireUtils {
    static removeModuleFromCache(module) {
        const findModule = (key) => key.includes(module);
        const moduleCacheKey = Object.keys(require.cache).find(findModule);
        delete require.cache[moduleCacheKey];
    }
}
exports.RequireUtils = RequireUtils;
