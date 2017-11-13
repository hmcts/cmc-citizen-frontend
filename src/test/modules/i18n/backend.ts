/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as path from 'path'

const expect = chai.expect
chai.use(spies)

import { Backend } from 'modules/i18n/backend'

describe('A gettext backend for i18next', () => {
  let backend

  beforeEach(() => {
    backend = new Backend(undefined, undefined)
  })

  it('should read all translations from PO file', (done) => {
    backend.init(null, {
      loadPath: path.join(__dirname, 'fixtures/translation.po')
    })

    backend.read('cy', 'translation', (err, translation) => {
      expect(err).to.be.null
      expect(translation).to.contain.all.keys({ 'Good morning': 'Bore da' })
      done()
    })
  })

  it('should fail with an error when file does not exist', (done) => {
    backend.init(null, {
      loadPath: '/tmp/non-existing-file'
    })

    backend.read('cy', 'translation', (err, translation) => {
      expect(err).to.be.an('error')
      expect(translation).to.be.null
      done()
    })
  })
})
