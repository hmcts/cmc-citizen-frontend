"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head'];
class HttpProxyCallInterceptor {
    static intercept(target, key, handler) {
        if (exports.HttpMethods.includes(key)) {
            const originalMethod = target[key];
            return (...args) => {
                handler(target, key, args);
                return originalMethod.apply(target, args);
            };
        }
        else {
            return target[key];
        }
    }
}
exports.HttpProxyCallInterceptor = HttpProxyCallInterceptor;
