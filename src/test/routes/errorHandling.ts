/* tslint:disable:no-unused-expression */
import 'test/routes/expectations'

import { errorHandler } from 'main/app'
import { expect } from 'chai'
import { ForbiddenError } from 'errors'

class ErrorStub {
  public statusCode: number
  public associatedView: string

  withStatusCode (statusCode: number) {
    this.statusCode = statusCode
    return this
  }

  withAssociatedView (associatedView: string) {
    this.associatedView = associatedView
    return this
  }
}

class ResponseStub {
  public statusValue: number
  public renderValue: string
  public redirectValue: string

  status (statusValue: number) {
    this.statusValue = statusValue
  }

  render (renderValue: string) {
    this.renderValue = renderValue
  }

  redirect (redirectValue: string) {
    this.redirectValue = redirectValue
  }
}

const next = () => undefined

describe('Error handling', () => {
  let res: ResponseStub

  beforeEach(() => {
    res = new ResponseStub()
  })

  it('should map an error with no status code to a 500', () => {
    errorHandler(new ErrorStub(), {}, res, next)
    expect(res.statusValue).to.equal(500)
    expect(res.renderValue.startsWith('error')).to.be.true
    expect(res.redirectValue).to.be.undefined
  })

  it('should redirect on a 302 with an associated view', () => {
    errorHandler(new ErrorStub().withStatusCode(302).withAssociatedView('shouldRedirectHere'), {}, res, next)
    expect(res.statusValue).to.equal(302)
    expect(res.renderValue).to.be.undefined
    expect(res.redirectValue).to.equal('shouldRedirectHere')
  })

  it('should redirect to an associated view when defined and not 302', () => {
    errorHandler(new ErrorStub().withStatusCode(418).withAssociatedView('associatedView'), {}, res, next)
    expect(res.statusValue).to.equal(418)
    expect(res.renderValue).to.equal('associatedView')
    expect(res.redirectValue).to.be.undefined
  })

  it('should render the forbidden view for 403', () => {
    errorHandler(new ErrorStub().withStatusCode(403), {}, res, next)
    expect(res.statusValue).to.equal(403)
    expect(res.renderValue).to.equal(new ForbiddenError().associatedView)
    expect(res.redirectValue).to.be.undefined
  })
})
