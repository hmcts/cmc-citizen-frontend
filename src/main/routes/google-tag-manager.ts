import { Request, Response, NextFunction } from 'express'
import { GTMArgs } from '@analytics/google-tag-manager'
import { RoutablePath } from 'shared/router/routablePath'

export function injectGtm(req: Request, res: Response, next: NextFunction): void {

  const gtmArgs: GTMArgs = {
    id: 'GTM-MRTZLBZ',
    dataLayer: {
      pageType: new RoutablePath('/*', false)
    }
  };
  const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmArgs.id}');`;
  const gtmNoscript = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmArgs.id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  res.locals.gtmScript = gtmScript;
  res.locals.gtmNoscript = gtmNoscript;
  next();
}