import * as nunjucks from 'nunjucks'
import { expect } from 'chai'
import * as path from 'path'

import { Form } from 'forms/form'

describe('textArea', () => {

  before(() => {
    const env = nunjucks.configure(path.join(__dirname, '../../../../'), {
      autoescape: true
    })
    env.addGlobal('t', (key: string): string => key)
  })

  it('should produce area with provided name, label and rows', () => {
    const name = 'reason'
    const label = 'Enter reason'
    const rows = 10
    const textArea = '<textarea id="' + name + '" name="' + name + '" rows="' + rows + '" class="form-control form-control-3-4 "></textarea>'
    let res = nunjucks.render('test/resources/textArea.njk', {
      label: label,
      name: name,
      rows: rows,
      emptyForm: new Form({}, [])
    })
    expect(res).to.contain(textArea)
    expect(res).to.contain(label)
  })
})
