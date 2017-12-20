import { ResponseCommon, ResponseType } from './responseCommon'

export enum DefenceType {
  DISPUTE = 'DISPUTE',
  ALREADY_PAID = 'ALREADY_PAID'
}

export interface FullDefenceResponse extends ResponseCommon {
  responseType: ResponseType.FULL_DEFENCE
  defenceType: DefenceType
  defence: string
}

export namespace FullDefenceResponse {
  export function deserialize (input: any): FullDefenceResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.FULL_DEFENCE,
      defenceType: input.defenceType,
      defence: input.defence
    }
  }
}
