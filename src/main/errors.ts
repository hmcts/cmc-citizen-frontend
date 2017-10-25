import { ErrorPaths } from 'claim/paths'

interface ViewError {
  statusCode: number
  associatedView?: string
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = 404
  associatedView: string = 'not-found'

  constructor (page: string) {
    super(`Page ${page} does not exist`)
  }
}

export class ForbiddenError extends Error implements ViewError {
  statusCode: number = 403
  associatedView: string = 'forbidden'

  constructor () {
    super(`You are not allowed to access this resource`)
  }
}

export class ClaimAmountExceedsLimitError extends Error implements ViewError {
  public static AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT: string = 'The total claim amount exceeds the stated limit of 10000'
  statusCode: number = 302
  associatedView: string = ErrorPaths.amountExceededPage.uri
  constructor (public message: string = ClaimAmountExceedsLimitError.AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT) {
    super(message)
    this.name = 'ClaimAmountExceedsLimitError'
  }
}
