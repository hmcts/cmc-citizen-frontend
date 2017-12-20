import { ResponseType } from './response/responseCommon'
import { FullDefenceResponse } from './response/fullDefenceResponse'
import { PartAdmissionResponse } from './response/partAdmissionResponse'

export type Response
  = FullDefenceResponse
  | PartAdmissionResponse

const deserializers = {
  [ResponseType.FULL_DEFENCE]: FullDefenceResponse.deserialize,
  [ResponseType.PART_ADMISSION]: PartAdmissionResponse.deserialize
}
export namespace Response {
  export function deserialize (input: any): Response {
    return deserializers[input.responseType](input)
  }
}
