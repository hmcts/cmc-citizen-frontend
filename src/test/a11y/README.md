# Pitfalls with existing Pa11y tests
The current implementation of Pa11y validattion/evaluattion is very good and covers majority of the accessibility errors. However DAC(Digital Accessibility Centre) has reported serveral accessibility issues that were either ignored or not considered as errors by Pa11y. 

# How to test DAC reported errors.
In order to ensure DAC reported errors are also tested as part of `Pa11y` tests, we had to add custom methods and assertions.

# How we did
Since the tests use `supertest` to get the page content as string html. Majority of the Pa11y tests run on this string html. 

We needed a way to parse through the elements in string html and further evaluate custom accessibility checks to ensure DAC tickets are covered. We were able to parse this string html and traverse the dom tree by using [JSDOM](https://www.npmjs.com/package/jsdom). Other alternatives for `JSDOM` are [Cheerio](https://www.npmjs.com/package/cheerio), [Parse5](https://www.npmjs.com/package/parse5)

All custom accessibility checks are manged in 'customChecks.ts' file. Custom checks can be performed on 
1. Custom accessibility tests can be performed on specific page/path/route or multiple pages/paths/routes.

``` javascript
// customChecks.ts file
export const test1 = (window, document) => {
  expect (document.getElementByid('someid').innerHTML).to.be.eq("Hello, how are you")
}


// a11y.ts file
import { test1 } from './customChecks'

// below configuration runs 'customAccessibilityChecks' expectations on 2 different routes

const testsOnSpecificPages = [
  {
    routes: ['specific/path/to/page', 'another/path/to/run/otherpage'],
    tests: [customAccessibilityChecks]
  }
]
    
```
2. Multiple custom accessibilty tests can be run on one specific route or multiple routes.

``` javascript
// customChecks.ts file
export const test1 = (window, document) => {
  expect (document.getElementByid('someid').innerHTML).to.be.eq("Hello, how are you")
}
export const customAccessibilityChecks = (window, document) => {
  expect (document.getElementByid('someid').innerHTML).to.be.eq("Hello, how are you")
}
export const checkInputLabels = (window, document) => {
  expect (document.getElementByid('someid').innerHTML).to.be.eq("Hello, how are you")
}

// a11y.ts file
// below configuration runs 'customAccessibilityChecks', 'checkInputLabels' & 'tes1' expectations on 2 different routes
import { customAccessibilityChecks, checkInputLabels, test1 } from './customChecks'

const testsOnSpecificPages = [
  {
    routes: ['specific/path/to/page', 'another/path/to/run/otherpage'],
    tests: [customAccessibilityChecks, checkInputLabels, test1]
  }
]
    
```

3. Generic tests can be added on all the routes as well.

``` javascript
// customChecks.ts file
// globalChecks run custom accessibility tests on all pages/routes

const globalChecks = (window: Window, document: Document, stringHtml: string) => {
  ...
  // add your generic expectations below 
  thisIsCustomGenericTest(window, document, stringHtml)
}
    
```

4. Can manage `get` or `post` method while requesting for page/path/route (default is `get`)

``` javascript
// both the pages in 'routes' use 'post' request
const testsOnSpecificPages = [
  {
    routes: ['specific/path/to/page', 'another/path/to/run/otherpage'],
    tests: [],
    requestDetails: {
      method: 'post'
    }
  }
]
    
```

5. Can send request body as well for post request method

``` javascript
// both the pages in 'routes' use 'post' request
const testsOnSpecificPages = [
  {
    routes: ['specific/path/to/page', 'another/path/to/run/otherpage'],
    tests: [],
    requestDetails: {
      method: 'post',
      send: {
        hello: 'Hello',
        message: 'how are you doing?'
      }
    }
  }
]
    
```
