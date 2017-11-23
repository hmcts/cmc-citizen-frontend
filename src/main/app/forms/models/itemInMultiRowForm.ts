export abstract class ItemInMultiRowForm {

  abstract deserialize (input?: any): ItemInMultiRowForm

  abstract isEmpty (): boolean
}
