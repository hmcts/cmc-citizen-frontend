"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractModelAccessor {
    patch(draft, patchFn) {
        const model = this.get(draft);
        patchFn(model);
        this.set(draft, model);
    }
}
exports.AbstractModelAccessor = AbstractModelAccessor;
class DefaultModelAccessor extends AbstractModelAccessor {
    constructor(property, defaultValueSupplierFn) {
        super();
        this.property = property;
        this.defaultValueSupplierFn = defaultValueSupplierFn;
    }
    get(draft) {
        return draft[this.property] ? draft[this.property] : (this.defaultValueSupplierFn ? this.defaultValueSupplierFn() : undefined);
    }
    set(draft, model) {
        draft[this.property] = model;
    }
}
exports.DefaultModelAccessor = DefaultModelAccessor;
