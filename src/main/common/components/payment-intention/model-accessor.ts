export interface ModelAccessor<Draft, Model> {
  get (draft: Draft): Model
  set (draft: Draft, model: Model): void
  patch (draft: Draft, patchOperation: (model: Model) => void): void
}

export class DefaultModelAccessor<Draft, Model> implements ModelAccessor<Draft, Model> {
  constructor (private property: string) {}

  get (draft: Draft): Model {
    return draft[this.property]
  }

  set (draft: Draft, model: Model): void {
    draft[this.property] = model
  }

  patch (draft: Draft, patchOperation: (model: Model) => void): void {
    draft[this.property] = patchOperation(draft[this.property])
  }
}
