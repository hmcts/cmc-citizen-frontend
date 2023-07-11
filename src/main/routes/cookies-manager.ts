import cookiesManager  from './lib/cookie-manager/dist/cookie-manager'
import { DtrumApi } from '@dynatrace/dtrum-api-types'
import * as express from 'express'

declare global {
  interface Window { 
    dataLayer: any[],
    enable(): DtrumApi
  }
}

export class CookiePreferencesManager {
    enableFor (app: express.Express) {
      app.use('/**', this.setupEventListeners)
    }

  config = {
    userPreferences: {
      cookieName: 'cmc-cookie-preferences',
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
  };

  constructor() {
    this.setupEventListeners();
    cookiesManager.init(this.config);
  }

  private setupEventListeners(): void {
    cookiesManager.on('UserPreferencesLoaded', (preferences: any) => {
      const dataLayer = window.dataLayer || [];
      dataLayer.push({ 'event': 'Cookie Preferences', 'cookiePreferences': preferences });
    });

    cookiesManager.on('UserPreferencesSaved', (preferences: any) => {
      const dataLayer = window.dataLayer || [];
      const dtrum = window.dtrum;
      dataLayer.push({ 'event': 'Cookie Preferences', 'cookiePreferences': preferences });

      if (dtrum !== undefined) {
        if (preferences.apm === 'on') {
          dtrum.enable();
          dtrum.enableSessionReplay(true);
        } else {
          dtrum.disableSessionReplay();
          dtrum.disable();
        }
      }
    });
  }
}