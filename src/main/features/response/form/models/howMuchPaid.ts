import { Serializable } from 'models/serializable'
export class ValidationErrors {
  static readonly DEFENCE_REQUIRED: string = "You need to explain why you don't owe the money"
  static readonly DEFENCE_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export default class HowMuchPaid implements Serializable<HowMuchPaid> {

  deserialize (input: any): HowMuchPaid {
    return null
  }
}
