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

  function escape (value) {
    if (!value) {
      throw new Error('Value is required to escape it')
    }
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new Error('Value has to be a string')
    }
    return value
      .replace('[', '\\[')
      .replace(']', '\\]')
  }

  function labelText (labelElement) {
    if (!labelElement) {
      throw new Error('Label element is required')
    }

    return labelElement.contents()
      .filter(function() {
        if ($(this).hasClass('form-hint')) {
          return false
        }
        return !!this.textContent.trim()
      })
      .text()
      .trim()
  }

  function findLabel (form, inputName) {
    if (!form) {
      throw new Error('Form is required')
    }
    if (!inputName) {
      throw new Error('Input name is required')
    }

    var inputElement = form.find('input[name=' + escape(inputName) + ']')
    if (inputElement.length > 0) {
      switch (inputElement[0].type) {
        case 'radio':
          if (!inputElement.is(':checked')) {
            return undefined
          }

          return labelText(form.find('label[for=' + escape(inputElement.filter(':checked')[0].id) + ']'))
        default:
          throw new Error('Input type is not supported')
      }
    }
  }

  // Send a google analytics event when an element that has the 'analytics-click-event-trigger' class is clicked.
  $('.analytics-click-event-trigger').on('click', function () {
    var label = $(this).data('eventLabel')
    sendEvent('Navigation', 'Click', label)
  })

  // Send a google analytics event when a form that has the 'analytics-click-event-trigger' class is submitted.
  $('.analytics-submit-event-trigger').on('submit', function () {
    var form = $(this)

    var action = form.data('eventAction')
    var label = findLabel(form, form.data('eventLabelFrom'))
    if (label) {
      sendEvent('Form', action, label)
    }
  })
})
