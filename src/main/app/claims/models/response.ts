import { ResponseType } from './response/responseCommon'
import { FullDefenceResponse } from './response/fullDefenceResponse'

export type Response
  = FullDefenceResponse

const deserializers = {
  [ResponseType.FULL_DEFENCE]: FullDefenceResponse.deserialize
}

export namespace Response {
  export function deserialize (input: any): Response {
    return deserializers[input.responseType](input)
  }
}
