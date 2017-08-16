import * as nunjucks from 'nunjucks'
import { expect } from 'chai'
import * as path from 'path'

describe('linkButton', () => {

  before(() => {
    const env = nunjucks.configure(path.join(__dirname, '../../../../'), {
      autoescape: true
    })
    env.addGlobal('t', (key: string): string => key)
  })

  it('should produce link button with provided label', () => {
    let label = 'Add another row'
    let name = 'addRow'
    let cssClass = 'button button-secondary'
    let linkButton = '<input type="submit" class="' + cssClass + '" name="' + name + '" value="' + label + '">'

    let response = nunjucks.render('test/resources/linkButton.njk', {
      label: label,
      name: name,
      class: cssClass
    })
    expect(response).to.contain(linkButton)
  })
})
