import { expect } from 'chai'

import { RoutablePath } from 'common/router/routablePath'

describe('RoutablePath', () => {
  describe('providing uri', () => {
    it('should strip index from the end of the uri', () => {
      expect(new RoutablePath('/response/index').uri).to.be.equal('/response')
    })
    it('should not strip index from the middle of the uri', () => {
      expect(new RoutablePath('/response/index-type').uri).to.be.equal('/response/index-type')
    })
  })

  describe('finding associated view', () => {
    describe('for features', () => {
      it('should return path within feature directory structure', () => {
        expect(new RoutablePath('/response/response-type').associatedView).to.be.equal('response/views/response-type')
        expect(new RoutablePath('/response/free-mediation/warning').associatedView).to.be.equal('response/views/free-mediation/warning')
      })

      it('should strip any path parameters', () => {
        expect(new RoutablePath('/claim/:externalId/confirmation').associatedView).to.be.equal('claim/views/confirmation')
        expect(new RoutablePath('/claim/:type/:subtype/list').associatedView).to.be.equal('claim/views/list')
      })
    })

    describe('for others', () => {
      it('should return path within main directory structure', () => {
        expect(new RoutablePath('/claim/start', false).associatedView).to.be.equal('claim/start')
        expect(new RoutablePath('/claim/defendant/name', false).associatedView).to.be.equal('claim/defendant/name')
      })

      it('should strip any path parameters', () => {
        expect(new RoutablePath('/claim/:externalId/confirmation', false).associatedView).to.be.equal('claim/confirmation')
        expect(new RoutablePath('/claim/:type/:subtype/list', false).associatedView).to.be.equal('claim/list')
      })
    })
  })
})
