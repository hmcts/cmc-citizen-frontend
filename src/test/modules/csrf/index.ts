import { expect } from 'chai'
import * as express from 'express'
import * as request from 'supertest'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import { CsrfProtection } from 'modules/csrf/index'

function createApp (): express.Express {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser('test-secret'))
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }))

  const csrf = new CsrfProtection()
  csrf.enableFor(app)

  app.get('/test', (req, res) => {
    res.json({ csrf: res.locals.csrf })
  })

  app.post('/test', (req, res) => {
    res.json({ ok: true })
  })

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN' || err.message?.includes('csrf')) {
      return res.status(403).json({ error: 'invalid csrf token' })
    }
    next(err)
  })

  return app
}

describe('CsrfProtection', () => {
  let app: express.Express

  beforeEach(() => {
    app = createApp()
  })

  it('should set csrf token in res.locals', async () => {
    const res = await request(app).get('/test')
    expect(res.status).to.equal(200)
    expect(res.body.csrf).to.be.a('string')
    expect(res.body.csrf.length).to.be.greaterThan(0)
  })

  it('should generate a csrf token on each request', async () => {
    const res1 = await request(app).get('/test')
    const res2 = await request(app).get('/test')
    expect(res1.body.csrf).to.be.a('string')
    expect(res2.body.csrf).to.be.a('string')
  })

  it('should accept valid csrf token from request body', async () => {
    const agent = request.agent(app)
    const getRes = await agent.get('/test')
    const token = getRes.body.csrf
    const cookies = getRes.headers['set-cookie']

    const postRes = await agent
      .post('/test')
      .set('Cookie', cookies)
      .send({ _csrf: token })

    expect(postRes.status).to.equal(200)
    expect(postRes.body.ok).to.equal(true)
  })

  it('should accept valid csrf token from header', async () => {
    const agent = request.agent(app)
    const getRes = await agent.get('/test')
    const token = getRes.body.csrf
    const cookies = getRes.headers['set-cookie']

    const postRes = await agent
      .post('/test')
      .set('Cookie', cookies)
      .set('x-csrf-token', token)
      .send({})

    expect(postRes.status).to.equal(200)
    expect(postRes.body.ok).to.equal(true)
  })

  it('should reject request with invalid csrf token', async () => {
    const agent = request.agent(app)
    const getRes = await agent.get('/test')
    const cookies = getRes.headers['set-cookie']

    const postRes = await agent
      .post('/test')
      .set('Cookie', cookies)
      .send({ _csrf: 'invalid-token' })

    expect(postRes.status).to.equal(403)
    expect(postRes.body.error).to.equal('invalid csrf token')
  })

  it('should reject request without csrf token', async () => {
    const agent = request.agent(app)
    const getRes = await agent.get('/test')
    const cookies = getRes.headers['set-cookie']

    const postRes = await agent
      .post('/test')
      .set('Cookie', cookies)
      .send({})

    expect(postRes.status).to.equal(403)
    expect(postRes.body.error).to.equal('invalid csrf token')
  })
})
