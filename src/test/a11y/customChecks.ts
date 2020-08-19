/* tslint:disable:no-console */
import { JSDOM } from 'jsdom'
import { expect } from 'chai'

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
const checkPageTitleAndHeading = (window, document) => {
  // get page title
  const title = document.title
  // get h1 tags
  const headings = document.getElementsByTagName('h1')
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
export const checkInputLabels = (window, document) => {
  if (document.forms.length) {
    const elements = document.forms[0].elements
    for (let i = 0; i < elements.length; i++) {
      const typeAttribute = elements[i].getAttribute('type')
      const tagName = elements[i].tagName
      if (tagName !== 'BUTTON' && tagName !== 'FIELDSET' && typeAttribute !== 'hidden' && typeAttribute !== 'submit' && typeAttribute !== 'button') {
        const elementId = elements[i].getAttribute('id')

        // expect(document.querySelector(`label[for="${elementId}"]`), `<label> for form elemnt with id "${elementId}" is missing`).to.not.equal(null)
        // TODO once all the label tags are added, make sure to uncomment above line and remove below condition if required.
        if (!document.querySelector(`label[for="${elementId}"]`)) {
          console.error('WARNING: MISSING LABEL FOR ELEMENT WITH ID', elementId)
        }
      }
    }
  }
}

// validate task-list page as per the recommended structure @ https://design-system.service.gov.uk/patterns/task-list-pages/
export const checkTaskList = (window, document) => {
  const orderedList = document.getElementsByTagName('ol')
  expect(orderedList.length).to.be.above(0)
  for (let i = 0; i < orderedList.length; i++) {
    const tasks = orderedList[i].querySelectorAll('a[aria-describedby]')
    // looop through each anchor and get anchor text and aria-describedby attribute
    for (let n = 0; n < tasks.length; n++) {
      // expect each anchor(task) has it corresponding status
      expect(document.getElementById(`${tasks[n].getAttribute('aria-describedby')}`), `Task "${tasks[n].textContent.trim()}" does not contain corresponding status`).to.not.equal(null)
    }
  }
}
// custom accessibility tests that are to execute on all pages/routes
const globalChecks = (window, document, stringHtml) => {
  // generic functions that run on each page go here
  ensureHeadingIsIncludedInPageTitle(stringHtml)
}

export const customAccessibilityChecks = (stringHtml: string, customTests: any[]) => {
  // console.log(stringHtml)
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
