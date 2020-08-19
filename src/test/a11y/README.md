# Pitfalls with existing Pa11y tests
The current implementation of Pa11y validates/evaluates is very good and covers majority of the accessibility errors. However DAC(Digital Accessibility Centre) has reported serveral accessibility issues that were either ignored or not considered as errors by Pa11y. 

# How to test DAC reported errors.
In order to ensure DAC reported errors are also tested as part of accessibility , we had to add custom methods and assertions.

# How we did
Since the tests use `supertest` to get the page content as string html. Majority of the Pa11y tests run on this string html. 

We needed a way to parse through the elements in string html and further evaluate custom accessibility checks to ensure DAC tickets are covered. We were able to parse this string html and traverse the dom tree by using [JSDOM](https://www.npmjs.com/package/jsdom). Other alternatives for `JSDOM` are [Cheerio](https://www.npmjs.com/package/cheerio), [Parse5](https://www.npmjs.com/package/parse5)

All custom accessibility checks are manged in 'customChecks.ts' file. Custom checks can be performed on 
1. Specific route or page.
2. All the routes

To perform specific custom tests on specific route then, update `checksOnSpecificRoutes` variable with required details
``` javascript
// customChecks.ts file
export const test1 = (window, document) => {
    expect (document.getElementByid('someid').innerHTML)
}

// a11y.ts file
import { customAccessibilityChecks, checkInputLabels, test1 } from './customChecks'

const checksOnSpecificRoutes = [
    {
        route: 'specific/path/to/run/tests',
        tests: [test1]
    }
]
    
```

