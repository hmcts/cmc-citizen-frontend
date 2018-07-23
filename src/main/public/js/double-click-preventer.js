(function () {
  document.addEventListener('DOMContentLoaded', function (event) {

    document.querySelectorAll('input[type=submit]')
      .forEach(function (element) {
        element.addEventListener('click', function (event) {
          if (element.className === 'button') {
            element.disabled = true
            element.form.submit()
          }
        })
      })
  })

})()


