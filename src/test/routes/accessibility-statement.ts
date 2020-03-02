import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

describe('Accessibility page', () => {
  describe('on GET', () => {
    it('should render accessibility page when everything is fine', async () => {
      await request(app)
        .get(Paths.accessibilityPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Accessibility statement for the Online Civil Money Claims service'))
    })
  })
})
