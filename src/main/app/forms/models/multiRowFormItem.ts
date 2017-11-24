export abstract class MultiRowFormItem {

  abstract deserialize (input?: any): MultiRowFormItem

  isEmpty (): boolean {
    const that = this
    let result: boolean = true
    Object.keys(this).forEach(key => result = result && !that[key])

    return result
  }
}
