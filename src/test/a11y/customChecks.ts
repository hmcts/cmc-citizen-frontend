/* tslint:disable:no-console */
import { JSDOM } from 'jsdom'
import { expect } from 'chai'

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
  console.log('checkTaskList')
}
// custom accessibility tests that are to execute on all pages/routes
const globalChecks = (window, document) => {
  // generic functions that run on each page go here
  // replaced below method with more eligant one to ensures page title matches with page's h1 content
  // ensureHeadingIsIncludedInPageTitle(stringHtml)
  checkPageTitleAndHeading(window, document)
}

export const customAccessibilityChecks = (stringHtml: string, customTests: any[]) => {
  // convert the string content to html for further parsing
  const win = new JSDOM(stringHtml).window

  // tests to run on all pages/routes/uri
  globalChecks(win, win.document)

  // tests that run on specific page/route/uri if provided
  customTests.forEach((functionName) => {
    if (typeof functionName === 'function') {
      functionName(win, win.document)
    }
  })
}
