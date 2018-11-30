import { ResponseType } from 'claims/models/response/responseType'
import { Response } from 'claims/models/response'

export class ResponseUtils {
  static isAdmissionsResponse (response: Response): boolean {
    return (response.responseType === ResponseType.FULL_ADMISSION
      || response.responseType === ResponseType.PART_ADMISSION)
  }
}
