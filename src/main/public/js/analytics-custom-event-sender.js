$(function () {
  function sendEvent (eventCategory, eventAction, eventLabel) {
    if (!eventCategory) {
      throw new Error('Event category is required')
    }
    if (!eventAction) {
      throw new Error('Event action is required')
    }
    if (!eventLabel) {
      throw new Error('Event label is required')
    }

    ga('send', 'event', eventCategory, eventAction, eventLabel)
  }

  function labelText (labelElement) {
    if (!labelElement) {
      throw new Error('Label element is required')
    }

    for (var content of labelElement.contents()) {
      const text = $(content).text().trim()
      if (text && content.class !== 'form-hint') {
        return text
      }
    }
    return undefined
  }

  function findLabel (form, inputName) {
    if (!form) {
      throw new Error('Form is required')
    }
    if (!inputName) {
      throw new Error('Input name is required')
    }

    var inputElement = form.find('input[name=' + inputName + ']')
    if (inputElement.length > 0) {
      switch (inputElement[0].type) {
        case 'radio':
          if (!inputElement.is(':checked')) {
            return undefined
          }

          return labelText(form.find('label[for=' + inputElement.filter(':checked')[0].id + ']'))
        default:
          throw new Error('Input type is not supported')
      }
    }
  }

  // Send a google analytics event when an element that has the 'analytics-click-event-trigger' class is clicked.
  // Example: <a href="http://somelink" class="analytics-click-event-trigger" data-event-label="Your GA label">Some text</a>
  $('.analytics-click-event-trigger').on('click', function () {
    var label = $(this).data('eventLabel')
    sendEvent('Navigation', 'Click', label)
  })

  // Send a google analytics event when a form that has the 'analytics-click-event-trigger' class is submitted.
  // Example <form method="post" class="analytics-submit-event-trigger" data-event-action="Your GA action" data-event-label-from="Form element to extract GA label from"></form>
  $('.analytics-submit-event-trigger').on('submit', function () {
    var form = $(this)

    var action = form.data('eventAction')
    var label = findLabel(form, form.data('eventLabelFrom'))
    if (label) {
      sendEvent('Form', action, label)
    }
  })
})
