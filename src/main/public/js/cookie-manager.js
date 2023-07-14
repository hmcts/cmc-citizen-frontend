const cookieManager = window.cookieManager;

cookieManager.on('UserPreferencesLoaded', (preferences) => {
  const dataLayer = window.dataLayer || [];
  dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
});

cookieManager.on('UserPreferencesSaved', (preferences) => {
  const dataLayer = window.dataLayer || [];
  const dtrum = window.dtrum;

  dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});

  if(dtrum !== undefined) {
    if(preferences.apm === 'on') {
      dtrum.enable();
      dtrum.enableSessionReplay();
    } else {
      dtrum.disableSessionReplay();
      dtrum.disable();
    }
  }
});

const config = {
  userPreferences: {
    cookieName: 'cmc-cookie-preferences',
  },
  cookieManifest: [
    {
      categoryName: 'essential',
      optional: false,
      cookies: [
        'i18next',
        'cmc-cookie-preferences',
        '_oauth2_proxy'
      ]
    },
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

cookieManager.init(config);