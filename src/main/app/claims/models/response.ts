import { ResponseType } from 'claims/models/response/responseType'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

export type Response = FullDefenceResponse | FullAdmissionResponse | PartialAdmissionResponse

const deserializers = {
  [ResponseType.FULL_DEFENCE]: FullDefenceResponse.deserialize,
  [ResponseType.FULL_ADMISSION]: FullAdmissionResponse.deserialize,
  [ResponseType.PART_ADMISSION]: PartialAdmissionResponse.deserialize
}

export namespace Response {
  export function deserialize (input: any): Response {
    return deserializers[input.responseType](input)
  }
}
