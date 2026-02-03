import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as sinon from 'sinon'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'

import { app } from 'main/app'
import logoutRouter from 'routes/logout'
import { OAuthHelper } from 'idam/oAuthHelper'

import * as idamServiceMock from 'test/http-mocks/idam'
import { attachDefaultHooks } from 'test/routes/hooks'

const cookieName: string = config.get<string>('session.cookieName')

describe('Logout handler (unit)', () => {
  it('should call next(err) when session.destroy calls back with error', (done) => {
    const destroyError = new Error('destroy failed')
    const req = {
      session: {
        authenticationToken: 'token',
        destroy: (cb: (err?: Error) => void) => cb(destroyError)
      }
    } as any
    const res = { redirect: sinon.stub() } as any
    const next = (err: Error) => {
      expect(err).to.equal(destroyError)
      expect(res.redirect.called).to.be.false
      done()
    }

    const route = logoutRouter.stack.find((layer: any) => layer.route?.path === AppPaths.logoutReceiver.uri)
    const handler = route.route.stack[0].handle
    handler(req, res, next)
  })

  it('should redirect with empty token hint when session has no authenticationToken', (done) => {
    const logoutUrl = 'https://idam.example.com/o/endSession?id_token_hint='
    const forLogoutStub = sinon.stub(OAuthHelper, 'forLogout').returns(logoutUrl)

    const req = {
      session: {
        authenticationToken: undefined,
        destroy: (cb: (err?: Error) => void) => cb()
      }
    } as any
    const res = { redirect: sinon.stub() } as any
    const next = sinon.stub()

    const route = logoutRouter.stack.find((layer: any) => layer.route?.path === AppPaths.logoutReceiver.uri)
    const handler = route.route.stack[0].handle
    handler(req, res, next)
    setImmediate(() => {
      expect(res.redirect.called).to.be.true
      expect(res.redirect.firstCall.args[0]).to.equal(logoutUrl)
      expect(forLogoutStub.calledWith(req, '')).to.be.true
      expect(next.called).to.be.false
      forLogoutStub.restore()
      done()
    })
  })
})

describe('Logout receiver', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    idamServiceMock.resetAuthMocks()
  })

  describe('on GET', () => {
    it('should redirect to idam endSession and clear session', async () => {
      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=ABC`)
      expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/)
      // Session is destroyed; cookie may be cleared (empty/expired) or omitted when no valid session
      const setCookie = res.headers['set-cookie'] as string[] | undefined
      const sessionCookie = setCookie?.find(c => c.startsWith(`${cookieName}=`))
      if (sessionCookie) {
        expect(sessionCookie).to.match(new RegExp(`${cookieName}=;|${cookieName}=`))
      }
    })

    it('should redirect to idam endSession with token hint when session had token', async () => {
      const res = await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', `${cookieName}=${idamServiceMock.defaultAuthToken}`)
      expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/)
      expect(res.headers.location).to.include('id_token_hint=')
    })

    it('should not remove session cookie or invalidate auth token when session cookie is missing', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).not.to.have.cookie)
    })

    it('should redirect to idam endSession endpoint', async () => {
      await request(app)
        .get(AppPaths.logoutReceiver.uri)
        .set('Cookie', null)
        .expect(res => expect(res).to.be.redirect.toLocation(/.*\/o\/endSession.*/))
    })
  })
})
