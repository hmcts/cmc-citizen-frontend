/* global describe, it */

import * as nunjucks from 'nunjucks'
import { expect } from 'chai'
import * as path from 'path'

import { Form } from 'forms/form'

describe('yesNoRadio', () => {

  const label = 'Have you already tried to resolve this dispute with the other party?'
  const name = 'resolved'
  const resolvedTrueChecked = '<input id="resolvedtrue" type="radio" name="' + name + '" value="true" checked'
  const resolvedTrueUnchecked = '<input id="resolvedtrue" type="radio" name="' + name + '" value="true" >'
  const resolvedFalseChecked = '<input id="resolvedfalse" type="radio" name="' + name + '" value="false" checked>'
  const resolvedFalseUnchecked = '<input id="resolvedfalse" type="radio" name="' + name + '" value="false" >'

  before(() => {
    const env = nunjucks.configure(path.join(__dirname, '../../../../'), {
      autoescape: true
    })
    env.addGlobal('t', (key: string): string => key)
  })

  it('should produce radio button with none checked with undefined form property', () => {
    let res = nunjucks.render('test/resources/yesNoRadio.njk', {
      label: label,
      name: name,
      emptyForm: new Form({ resolved: undefined }, [])
    })

    expect(res).to.contain(resolvedTrueUnchecked).and.to.contain(resolvedFalseUnchecked)
  })

  it('should produce radio button with none checked with null form property', () => {
    let res = nunjucks.render('test/resources/yesNoRadio.njk', {
      label: label,
      name: name,
      emptyForm: new Form({ resolved: null }, [])
    })

    expect(res).to.contain(resolvedTrueUnchecked).and.to.contain(resolvedFalseUnchecked)
  })

  it('should produce radio button with only No checked', () => {
    let res = nunjucks.render('test/resources/yesNoRadio.njk', {
      label: label,
      name: name,
      emptyForm: new Form({ resolved: false }, [])
    })

    expect(res).to.contain(resolvedTrueUnchecked).and.to.contain(resolvedFalseChecked)
  })

  it('should produce radio button with only Yes checked', () => {
    let res = nunjucks.render('test/resources/yesNoRadio.njk', {
      label: label,
      name: name,
      emptyForm: new Form({ resolved: true }, [])
    })

    expect(res).to.contain(resolvedTrueChecked).and.to.contain(resolvedFalseUnchecked)
  })

})
