/* tslint:disable:no-console */
import { JSDOM } from 'jsdom'
import { expect } from 'chai'

export type CustomChecks = { (window: Window, document: Document): void; }[]

function ensureHeadingIsIncludedInPageTitle (text: string): void {
  const title: string = text.match(/<title>(.*)<\/title>/)[1]
  const heading: RegExpMatchArray = text.match(/<h1 class="heading-large">\s*(.*)\s*<\/h1>/)

  if (heading) { // Some pages does not have heading section e.g. confirmation pages
    expect(title).to.be.equal(`${heading[1]} - Money Claims`)
  } else {
    expect(title).to.be.not.equal(' - Money Claims')
    console.log(`NOTE: No heading found on page titled '${title}' exists`)
  }
}

// ensure page title matches with page's h1 content
export const checkPageTitleAndHeading = (window, document) => {
  // get page title
  const title = document.title
  // get h1 tags
  const headings = document.getElementsByTagName('h1')
  console.log('.......', headings.length, '.....', headings[0].textContent)
  // ensure only one h1 is present per page
  if (headings.length) {
    // expect(headings.length, `Only one <h1> tag is expected, instead noticed ${headings.length} in ${title}`).to.be.eq(1)
    if (headings.length > 1) {
      console.log(`WARNING: ONLY 1 <H1> tag IS EXPECTED BUT FOUND ${headings.length} in ${title}`)
    }
    const heading = headings[0].innerHTML.trim()
    expect(title).to.be.equal(`${heading} - Money Claims`)
  } else {
    console.log(`NOTE: No heading found on page titled '${title}'`)
  }
}

// ensure every input/select/radio/checkbox/textarea has it own corresponding label
export const checkInputLabels = (window: Window, document: Document) => {
  if (document.forms.length) {
    const elements = document.forms[0].elements
    for (let i = 0; i < elements.length; i++) {
      const typeAttribute = elements[i].getAttribute('type')
      const tagName = elements[i].tagName
      if (tagName !== 'BUTTON' && tagName !== 'FIELDSET' && typeAttribute !== 'hidden' && typeAttribute !== 'submit' && typeAttribute !== 'button') {
        const elementId = elements[i].getAttribute('id')
        expect(document.querySelector(`label[for="${elementId}"]`), `<label> for form elemnt with id "${elementId}" is missing`).to.not.equal(null)
      }
    }
  }
}

// validate task-list page as per the recommended structure @ https://design-system.service.gov.uk/patterns/task-list-pages/
export const checkTaskList = (window: Window, document: Document) => {
  const orderedList = document.getElementsByTagName('ol')
  expect(orderedList.length, 'Task-list page should contain atleast one <ol> with list of tasks').to.be.above(0)
  for (let i = 0; i < orderedList.length; i++) {
    const tasks = orderedList[i].querySelectorAll('a[aria-describedby]')
    // looop through each anchor and get anchor text and aria-describedby attribute
    for (let n = 0; n < tasks.length; n++) {
      // expect each anchor(task) has it corresponding status
      expect(document.getElementById(`${tasks[n].getAttribute('aria-describedby')}`), `Task "${tasks[n].textContent.trim()}" does not contain corresponding status`).to.not.equal(null)
    }
  }
}

// validate checkAnswers page as per the recommended structure @ https://design-system.service.gov.uk/patterns/check-answers/
export const checkAnswers = (window: Window, document: Document) => {
  // this expects and validates a html structrue like below
  /**
   * <dl>
   *  <div>
   *    <dt>Full name</dt>
   *    <dd>Jonatha</dd>
   *    <dd> <a href="/path/to/edit/full-name">Change <span class="visually-hidden">full name</span></a></dd>
   *  </div>
   * </dl>
   */
  const definitionList = document.getElementsByTagName('dl')
  expect(definitionList.length, 'Task-list page should contain atleast one <dl> tag with list of answers provided').to.be.greaterThan(0)

  for (let i = 0; i < definitionList.length; i++) {
    const childElements = definitionList[i].children
    for (let c = 0; c < childElements.length; c++) {
      // compare first child text with last child's link text
      const dt = childElements[c].children[0].textContent.trim().toLocaleLowerCase() // content of <dt>...</dt>
      const link = childElements[c].children[2].querySelector('a') // <a href="/path...">...</a> or null
      if (link) {
        expect('Change ' + dt).to.equal(link.textContent.trim())
      } else {
        console.log('INFO: no change link available for "' + dt + '"')
      }
    }
  }
}

/**
 *
 * @param window
 * @param document
 * expect error container with class 'error-summary' is present
 * expect h2 tag for error messages
 * expect 'There was a problem' text in h2
 * only one h1 tag per page
 */
export const checkError = (window: Window, document: Document) => {
  const className = 'error-summary'
  const errorContainer = document.getElementsByClassName(className)
  // should contain only one error-summary
  expect(errorContainer.length, `div element with '${className}' must be present`).to.be.equal(1)
  // error-summary div should contain <h2>There was a problem</h2>
  const heading = errorContainer[0].getElementsByTagName('h2')
  expect(heading.length, 'Error heading should use h2 tag').to.be.eq(1)
  expect(heading[0].textContent.trim()).to.be.eq('There was a problem')
}

export const checkRole = (window: Window, document: Document) => {
  // this expects and validates 'Total monthly income' 'p' tag has role="status" and aria-live="polite"
  /**
   * <p class="heading-small calculation-outcome-container" role="status" aria-live="polite">
   *  {{ t('Total monthly income:') }} £<span class="total-monthly-income-expense"> {{ totalMonthlyIncomeExpense | default('0.00') }} </span>
   * </p>
   */
  const elementWithTotal = document.getElementsByClassName('calculation-outcome-container')
  expect(elementWithTotal.length, 'Income / Expence page must have role="status" and aria-live="polite" for the "p" tag').to.be.greaterThan(0)

  for (let i = 0; i < elementWithTotal.length; i++) {
    const attributesName = elementWithTotal[i].getAttributeNames()
    expect(attributesName.length,'Total Income / Expence "p" tag must have "role" & "aria-live" attributes').to.be.greaterThan(2)
    if (expect(attributesName).to.contains('aria-live') && expect(attributesName).to.contains('role')) {
      expect(elementWithTotal[0].getAttribute('role')).to.equal('status')
      expect(elementWithTotal[0].getAttribute('aria-live')).to.equal('polite')
    } else {
      console.log('INFO: no role and aria-live attributes present in the "p" tag')
    }
  }
}

export const checkButton = (window: Window, document: Document) => {
  // this expects and validates 'aria-label' attribute is present in the submit button"
  /**
   * <input type="submit" class="button" aria-label="I confirm I’ve read this information about resolving disputes" value="I confirm I’ve read this">
   */
  const buttonList = document.getElementsByClassName('button')
  expect(buttonList.length, 'resolving-this-dispute page must have submite button').to.be.equal(1)
  const attributesName = buttonList[0].getAttributeNames()
  expect(attributesName.length).to.be.greaterThan(1)
  expect(attributesName).to.contains('aria-label')
}

/**
 *
 * @param window window object
 * @param document document object
 * @param stringHtml html as string returned by the supertest
 */
// custom accessibility tests that are to execute on all pages/routes
const globalChecks = (window: Window, document: Document, stringHtml: string) => {

  // generic functions that run on each page go here
  ensureHeadingIsIncludedInPageTitle(stringHtml)

  // checkPageTitleAndHeading(window, document)
}

/**
 *
 * @param stringHtml html as string(response.text) returned by the supertest request
 * @param customTests array of methods that contain chai 'expect' statements
 */
export const customAccessibilityChecks = (stringHtml: string, customTests: any[]) => {
  // convert the string content to html for further parsing
  const win = new JSDOM(stringHtml).window

  // tests to run on all pages/routes/uri
  globalChecks(win, win.document, stringHtml)

  // tests that run on specific page/route/uri if provided
  customTests.forEach((functionName) => {
    if (typeof functionName === 'function') {
      functionName(win, win.document)
    }
  })
}
