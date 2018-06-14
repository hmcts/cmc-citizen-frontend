import { ResponseType } from 'claims/models/response/responseCommon'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullDefenceAdmission'

export type Response = FullDefenceResponse | FullAdmissionResponse

const deserializers = {
  [ResponseType.FULL_DEFENCE]: FullDefenceResponse.deserialize,
  [ResponseType.FULL_ADMISSION]: FullAdmissionResponse.deserialize
}

export namespace Response {
  export function deserialize (input: any): Response {
    return deserializers[input.responseType](input)
  }
}
