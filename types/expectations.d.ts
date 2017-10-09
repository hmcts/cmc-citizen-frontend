declare namespace Chai {
  interface Assertion {
    successful: RenderAssertion
    serverError: RenderAssertion
    forbidden: RenderAssertion
    redirect: RedirectAssertion
    cookie (cookieName: string, cookieValue: string): Assertion
  }
  interface RenderAssertion {
    withText (...text: string[]): Assertion
  }
  interface RedirectAssertion {
    toLocation (location: string | RegExp): Assertion
  }
}
