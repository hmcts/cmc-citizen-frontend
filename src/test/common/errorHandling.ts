/* tslint:disable:no-unused-expression */
import { ErrorHandling } from 'shared/errorHandling'
import * as express from 'express'

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(spies)
const expect = chai.expect

describe('ErrorHandling', () => {
  const resolvingRequestHandler = sinon.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    return undefined
  })

  const rejectingRequestHandler = sinon.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    throw new Error('An error occurred')
  })

  const nextFunction = sinon.spy(() => {
    // Nothing to do, I'm a mock
  })

  it('should invoke given request handler', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler)
    // @ts-ignore
    await handled(mockReq, mockRes, nextFunction)
    expect(resolvingRequestHandler).to.have.been.calledWith(mockReq, mockRes, nextFunction)
  })

  it('should not invoke next function when the request handler is successful', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler)
    // @ts-ignore
    await handled(mockReq, mockRes, nextFunction)
    expect(nextFunction).to.have.not.been.called
  })

  it('should invoke next function when the request handler has failed', async () => {
    const handled = ErrorHandling.apply(rejectingRequestHandler)
    // @ts-ignore
    await handled(mockReq, mockRes, nextFunction)
    expect(nextFunction).to.have.been.called
  })
})
