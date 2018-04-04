import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'common/errorHandling'
import { PdfGenerator } from 'services/pdfGenerator'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ErrorHandling.apply(PdfGenerator.requestHandler))
