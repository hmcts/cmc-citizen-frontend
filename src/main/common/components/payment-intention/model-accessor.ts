export abstract class AbstractModelAccessor<Draft, Model> {
  abstract get (draft: Draft): Model
  abstract set (draft: Draft, model: Model): void

  patch (draft: Draft, patchFn: (model: Model) => void): void {
    const model: Model = this.get(draft)
    patchFn(model)
    this.set(draft, model)
  }
}

export class DefaultModelAccessor<Draft, Model> extends AbstractModelAccessor<Draft, Model> {
  constructor (private property: string, private defaultValueSupplierFn?: () => Model) {
    super()
  }

  get (draft: Draft): Model {
    return draft[this.property] ? draft[this.property] : (this.defaultValueSupplierFn ? this.defaultValueSupplierFn() : undefined)
  }

  set (draft: Draft, model: Model): void {
    draft[this.property] = model
  }
}
