import { ResponseCommon, ResponseType } from './responseCommon'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'

export enum DefenceType {
  DISPUTE = 'DISPUTE',
  ALREADY_PAID = 'ALREADY_PAID'
}

export interface FullDefenceResponse extends ResponseCommon {
  responseType: ResponseType.FULL_DEFENCE
  defenceType: DefenceType
  defence: string
  paymentDeclaration: PaymentDeclaration
}

export namespace FullDefenceResponse {
  export function deserialize (input: any): FullDefenceResponse {
    return {
      ...ResponseCommon.deserialize(input),
      defenceType: input.defenceType,
      defence: input.defence,
      paymentDeclaration: input.paymentDeclaration ? new PaymentDeclaration().deserialize(input.paymentDeclaration) : undefined
    }
  }
}
