(function () {
  document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('input[type=submit]')
      .forEach(function (element) {
        element.addEventListener('click', function () {
          if (element.className === 'button') {
            element.disabled = true
            element.form.submit()
          }
        })
      })
  })

})()


