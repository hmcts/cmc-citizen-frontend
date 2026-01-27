import 'express-session'

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string
      email: string
      forename: string
      surname: string
      roles: string[]
      group: string
      bearerToken: string
    }
  }
}
