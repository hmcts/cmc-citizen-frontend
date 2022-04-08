import { ErrorPaths } from 'claim/paths'

interface ViewError {
  statusCode: number
  associatedView?: string
}

export class NotFoundError extends Error implements ViewError {
  statusCode = 404
  associatedView = 'not-found'

  constructor (page: string) {
    super(`Page ${page} does not exist`)
  }
}

export class ForbiddenError extends Error implements ViewError {
  statusCode = 403
  associatedView = 'forbidden'

  constructor () {
    super(`You are not allowed to access this resource`)
  }
}

export class ClaimAmountExceedsLimitError extends Error implements ViewError {
  public static AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT = 'The total claim amount exceeds the stated limit of 10000'
  statusCode = 302
  associatedView: string = ErrorPaths.amountExceededPage.uri
  constructor (public message: string = ClaimAmountExceedsLimitError.AMOUNT_EXCEED_ALLOWED_CLAIM_LIMIT) {
    super(message)
    this.name = 'ClaimAmountExceedsLimitError'
  }
}
