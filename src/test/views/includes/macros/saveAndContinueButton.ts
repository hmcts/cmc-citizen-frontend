import * as nunjucks from 'nunjucks'
import { expect } from 'chai'
import * as path from 'path'

describe('saveAndContinueButton', () => {

  before(() => {
    const env = nunjucks.configure(path.join(__dirname, '../../../../'), {
      autoescape: true
    })
    env.addGlobal('t', (key: string): string => key)
  })

  it('should produce submit button with label Save and continue', () => {
    const defaultTag = '<input type="submit" class="button" value="Save and continue">'
    let res = nunjucks.render('test/resources/saveAndContinueButton.njk', {})
    expect(res).to.contain(defaultTag)
  })
})
