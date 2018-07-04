import { ResponseType } from 'claims/models/response/responseType'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullDefenceAdmission'
import { PartAdmissionResponse } from 'claims/models/response/partDefenceAdmission'

export type Response = FullDefenceResponse | FullAdmissionResponse | PartAdmissionResponse

const deserializers = {
  [ResponseType.FULL_DEFENCE]: FullDefenceResponse.deserialize,
  [ResponseType.FULL_ADMISSION]: FullAdmissionResponse.deserialize,
  [ResponseType.PART_ADMISSION]: PartAdmissionResponse.deserialize
}

export namespace Response {
  export function deserialize (input: any): Response {
    return deserializers[input.responseType](input)
  }
}
