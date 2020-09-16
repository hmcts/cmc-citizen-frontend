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
    expect(tasks.length).to.be.greaterThan(0)
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
  expect(buttonList.length, 'resolving-this-dispute page must have submit button').to.be.equal(1)
  const attributesName = buttonList[0].getAttributeNames()
  expect(attributesName.length).to.be.greaterThan(1)
  expect(attributesName).to.contains('aria-label')
}

export const checkEligibilityLinks = (window: Window, document: Document) => {
  // this expects and validates Links that open in a new window must include the "(opens in a new window)" text as part of the link"
  /**
   * <a href="https://www.gov.uk/call-charges" rel="noreferrer noopener" target="_blank">Find out about call charges<span class="govuk-link govuk-link-no-white-space"> (opens in a new window)</span></a>
   */
  const linkList = document.getElementsByTagName('a')
  expect(linkList.length, 'not-eligible page must have hyperlink').to.be.greaterThan(0)
  for (let i = 0; i < linkList.length; i++) {
    const attributesName = linkList[i].getAttributeNames()
    if (expect(attributesName).to.contains('href') && (linkList[i].getAttribute('href').search('https://') || (linkList[i].getAttribute('href').search('http://'))) && linkList[i].getAttribute('target') === '_blank') {
      const linkContent = linkList[i].text.search('(opens in a new window)')
      expect(linkContent).to.be.greaterThan(1)
      expect(linkList[i].getAttribute('rel')).to.equal('noreferrer noopener')
    } else {
      console.log('INFO: It is not the open in new window "a" tag')
    }
  }
}

// validate Total page as per the recommended structure @ https://design-system.service.gov.uk/components/table/
export const checkTable = (window: Window, document: Document) => {
  // this expects and validates a html structrue like below
  /**
   *     <table class="table-form form-group">
   *        <caption class="visuallyhidden"></caption>
   *         <tbody>
   *         </tbody>
   *         <tfoot>
   *           <tr>
   *             <th scope="col"><span class="bold-small">Total claim amount</span></th>
   *             <td class="numeric last"><span class="bold-medium">£100</span></td>
   *           </tr>
   *         </tfoot>
   *       </table>
   */
  const tableList = document.getElementsByTagName('table')
  expect(tableList.length, 'Total amount you’re claiming page should contain atleast one <table> tag with body and footer').to.be.greaterThan(0)

  for (let i = 0; i < tableList.length; i++) {
    const childElements = tableList[i].children
    if (childElements.length === 3 && tableList[i].textContent.search('Total claim amount') > 0) {
      expect(childElements.length,'Table must have 3 child nodes').to.be.eql(3)
      expect(childElements[0].nodeName,'Table first child must be CAPTION').to.be.eql('CAPTION')
      expect(childElements[1].nodeName,'TBODY must come after CAPTION').to.be.eql('TBODY')
      expect(childElements[2].nodeName,'TFOOT must come after TBODY').to.be.eql('TFOOT')
    }
  }
}

export const checkMultipleChoice = (window: Window, document: Document) => {
  // this expects and validates the radio button text
  /**
   * <Checkbox label> <priority-debts> <Radio button option>
   * e.g :  mortgage priority-debts Week
   */
  const checkBoxList = document.getElementsByClassName('expandable-checkbox-option')
  expect(checkBoxList.length, 'priority-debts page must have 7 check-boxs ').to.be.equal(7)
  for (let i = 0; i < checkBoxList.length; i++) {
    const checkbox = checkBoxList[i].getElementsByClassName('multiple-choice expandable')
    let checkboxText = checkbox[0].firstElementChild.nextElementSibling.innerHTML.trim().toLocaleLowerCase()
    if (checkboxText.search('council') === 0) {
      checkboxText = 'councilTax'
    } else if (checkboxText.search('maintenance') === 0) {
      checkboxText = 'maintenance'
    }
    const fieldsetList = checkBoxList[i].getElementsByTagName('fieldset')
    const legendText = fieldsetList[0].firstElementChild.firstElementChild.innerHTML.trim()
    const labelText = '<span class="visually-hidden">' + checkboxText + ' ' + legendText + '</span>'
    const radioButtons = fieldsetList[0].getElementsByClassName('multiple-choice')
    for (let p = 0; p < radioButtons.length; p++) {
      const labelTextToValidate = radioButtons[p].firstElementChild.nextElementSibling.firstElementChild.outerHTML
      expect(labelTextToValidate, 'Radio button label must have visually hidden text').to.be.eql(labelText)
    }
  }
}

export const checkClaimAmountRows = (window: Window, document: Document) => {
  // this expects and validates the claim amount rows
  const claimAmountRowsList = document.getElementsByClassName('claim-amount-rows')
  const rows = claimAmountRowsList[0].getElementsByClassName('claim-amount-row')
  expect(rows.length, 'Claim amount table must have minimum of 4 rows').to.be.greaterThan(3)
  for (let p = 0; p < rows.length; p++) {
    const hiddenTextList = rows[p].getElementsByClassName('visually-hidden')
    const reasonText = hiddenTextList[0].innerHTML.trim()
    const amountText = hiddenTextList[1].innerHTML.trim()
    expect(reasonText, 'Visually Hiddent text for Reason Textbox').to.be.eql((p + 1) + '. What you’re claiming for')
    expect(amountText, 'Visually Hiddent text for Amount Textbox').to.be.eql((p + 1) + '. Amount')
  }
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
