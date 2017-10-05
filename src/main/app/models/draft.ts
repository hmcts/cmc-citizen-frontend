import { Moment } from 'moment'

import { DraftDocument } from 'models/draftDocument'

export class Draft<T extends DraftDocument> {
  constructor (public id: number = undefined, public type: string, public document: T, public created?: Moment, public updated?: Moment) {}
}
