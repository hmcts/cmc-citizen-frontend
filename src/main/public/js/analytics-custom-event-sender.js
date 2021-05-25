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
    var cookies_policy = getCookie("cookies_policy");
    var json = JSON.parse(this.response);
    if (!cookies_policy && cookies_policy.split(',')[1].split(':')[1] === 'true')
    {
      var label = $(this).data('eventLabel')
      sendEvent('Navigation', 'Click', label)
      window['ga-disable'+json.gaTrackingId] = false
    } else {
      window['ga-disable'+json.gaTrackingId] = true
    }
  })

  // Send a google analytics event when a form that has the 'analytics-click-event-trigger' class is submitted.
  $('.analytics-submit-event-trigger').on('submit', function () {
    var cookies_policy = getCookie("cookies_policy");
    var json = JSON.parse(this.response);
    if (!cookies_policy && cookies_policy.split(',')[1].split(':')[1] === 'true')
    {
      var form = $(this)

      var action = form.data('eventAction')
      var label = findLabel(form, form.data('eventLabelFrom'))
      if (label) {
        window['ga-disable-'+json.gaTrackingId] = false
        sendEvent('Form', action, label)
      }
    } else {
      window['ga-disable-'+json.gaTrackingId] = true
    }
  })

  function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
})
