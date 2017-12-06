export abstract class MultiRowFormItem {

  abstract deserialize (input?: any): MultiRowFormItem

  isEmpty (): boolean {
    return Object.values(this).every(value => !value)
  }

  isAtLeastOneFieldPopulated (): boolean {
    return Object.values(this).some(value => value !== undefined)
  }
}
