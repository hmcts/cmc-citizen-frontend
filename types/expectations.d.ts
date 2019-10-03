declare namespace Chai {
  interface Assertion {
    successful: RenderAssertion
    serverError: RenderAssertion
    redirect: RedirectAssertion
    forbidden: RenderAssertion
    notFound: RenderAssertion
    badRequest: RenderAssertion
    cookie (cookieName: string, cookieValue: string): Assertion
  }

  interface RenderAssertion {
    withText (...text: string[]): Assertion
    withoutText (...text: string[]): Assertion
  }

  interface RedirectAssertion {
    toLocation (location: string | RegExp): Assertion
  }
}
