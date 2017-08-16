import { ErrorHandling } from 'common/errorHandling'
import * as express from 'express'

import * as chai from 'chai'
import * as spies from 'chai-spies'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(spies)
const expect = chai.expect

describe('ErrorHandling', () => {
  const resolvingRequestHandler = chai.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    return undefined
  })

  const rejectingRequestHandler = chai.spy((req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    throw new Error('An error occurred')
  })

  const nextFunction = chai.spy(() => {
    // Nothing to do, I'm a mock
  })

  it('should invoke given request handler', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler)
    await handled(mockReq, mockRes, nextFunction)
    expect(resolvingRequestHandler).to.have.been.called.with(mockReq, mockRes, nextFunction)
  })

  it('should not invoke next function when the request handler is successful', async () => {
    const handled = ErrorHandling.apply(resolvingRequestHandler)
    await handled(mockReq, mockRes, nextFunction)
    expect(nextFunction).not.to.have.been.called()
  })

  it('should invoke next function when the request handler has failed', async () => {
    const handled = ErrorHandling.apply(rejectingRequestHandler)
    await handled(mockReq, mockRes, nextFunction)
    expect(nextFunction).to.have.been.called()
  })
})
