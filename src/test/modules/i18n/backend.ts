/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as path from 'path'
import { Backend } from 'modules/i18n/backend'

const expect = chai.expect
chai.use(spies)

describe('A gettext backend for i18next', () => {
  let backend

  beforeEach(() => {
    backend = new Backend(undefined, undefined)
  })

  it('should read all translations from PO file', function (done) {
    this.timeout(6000)
    backend.init(null, {
      loadPath: path.join(__dirname, 'fixtures/translation.po')
    })

    backend.read('cy', 'translation', (err, translation) => {
      expect(err).to.be.null
      expect(translation).to.contain.all.keys({ 'Good morning': 'Bore da' })
      done()
    })
  })

  it('should fail with an error when file does not exist', function (done) {
    this.timeout(6000)
    backend.init(null, {
      loadPath: '/tmp/non-existing-file'
    })

    backend.read('cy', 'translation', (error, translation) => {
      expect(error).to.be.an('error')
      expect(translation).to.be.null
      done()
    })
  })

  it('should fail with an exception when translation fails', function (done) {
    this.timeout(6000)
    backend.init(null, {
      loadPath: path.join(__dirname, 'fixtures/invalid_translation.po')
    })

    backend.read('cy', 'translation', (error, translation) => {
      expect(error).not.to.be.null
      done()
    })
  })
})
