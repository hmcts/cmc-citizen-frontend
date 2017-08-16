import * as nunjucks from 'nunjucks'
import { expect } from 'chai'
import * as path from 'path'

describe('submitButton', () => {

  before(() => {
    const env = nunjucks.configure(path.join(__dirname, '../../../../'), {
      autoescape: true
    })
    env.addGlobal('t', (key: string): string => key)
  })

  it('should produce submit button with provided label', () => {
    const label = 'Save and Continue'
    const submitTag = '<input type="submit" class="button" value="' + label + '">'
    let res = nunjucks.render('test/resources/submitButton.njk', {
      label: label
    })
    expect(res).to.contain(submitTag)
  })

  it('should produce submit button with default label', () => {
    const defaultTag = '<input type="submit" class="button" value="Continue">'
    let res = nunjucks.render('test/resources/submitButton.njk', {})
    expect(res).to.contain(defaultTag)
  })

})
