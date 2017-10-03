import * as express from 'express'
import * as config from 'config'

import { Paths as AppPaths } from 'app/paths'
import * as toBoolean from 'to-boolean'
import { buildURL } from 'utils/callbackBuilder'

import * as Cookies from 'cookies'
import { ErrorHandling } from 'common/errorHandling'
import IdamClient from 'idam/idamClient'
import { AuthToken } from 'idam/authToken'

async function getAuthToken (req: express.Request) {
  const { code } = req.query
  const clientId = config.get<string>('oauth.clientId')
  const clientSecret = config.get<string>('oauth.clientSecret')
  const redirectUri = buildURL(req, AppPaths.oauth.uri.substring(1))
  const url = `${config.get('idam.api.url')}/oauth2/token?grant_type=authorization_code&code=${code}&client_secret=${clientSecret}&client_id=${clientId}&redirect_uri=${redirectUri}`

  return await IdamClient.retrieveAuthToken(url)
}

export default express.Router()
  .get(AppPaths.oauth.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    if (!useOauth && req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    } else if (useOauth) {
      const authToken: AuthToken = await getAuthToken(req)
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    return res.redirect(AppPaths.receiver.uri)
  }))
