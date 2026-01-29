import 'express-session'

declare module 'express-session' {
  interface SessionData {
    authenticationToken?: string
  }
}
