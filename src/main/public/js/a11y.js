/* global HTMLCS, HTMLCSAuditor */

var STANDARD = 'WCAG2AA'

HTMLCS.process(STANDARD, document.body, function () {
  var errors =
    HTMLCS
      .getMessages()
      .filter(function (m) {
        return m.type === HTMLCS.ERROR
      })

  if (errors.length > 0) {
    document.body.innerHTML +=
      "<div class='error-summary'>" +
      "<h1 class='heading-medium'>" + errors.length + ' accessibility violations found</h1>' +
      '</div>'

    HTMLCSAuditor.run(STANDARD, null, { includeCss: false })
  }
})
