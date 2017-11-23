export abstract class MultiRowFormItem {

  abstract deserialize (input?: any): MultiRowFormItem

  abstract isEmpty (): boolean
}
