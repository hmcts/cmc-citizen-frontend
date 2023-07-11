import * as cookiesManager  from '@hmcts/cookie-manager'
import { DtrumApi } from '@dynatrace/dtrum-api-types'

declare global {
  interface Window { 
    dataLayer: any[],
    enable(): DtrumApi
  }
}

export function userPreferencesLoaded (req: Request, res: Response, next: NextFunction): void  {
  cookiesManager.on('UserPreferencesLoaded', (preferences) => {
    const dataLayer = window.dataLayer || []
    dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences})
  })
  cookiesManager.init(config)
  next()
}

export function userPreferencesSaved (req: Request, res: Response, next: NextFunction): void {
  cookiesManager.on('UserPreferencesSaved', (preferences) => {
    const dataLayer = window.dataLayer || []
    const dtrum = window.dtrum
  
    dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences})
  
    if(dtrum !== undefined) {
      if(preferences.apm === 'on') {
        dtrum.enable()
        dtrum.enableSessionReplay(true)
      } else {
        dtrum.disableSessionReplay()
        dtrum.disable()
      }
    }
  })
  cookiesManager.init(config)
  next()
}

const config = {
  userPreferences: {
    cookieName: 'Money-Claims-cookie-preferences',
  },
  cookieManifest: [
    {
      categoryName: 'analytics',
      cookies: [
        '_ga',
        '_gid',
        '_gat_UA-'
      ]
    },
    {
      categoryName: 'apm',
      cookies: [
        'dtCookie',
        'dtLatC',
        'dtPC',
        'dtSa',
        'rxVisitor',
        'rxvt'
      ]
    }
  ]
}