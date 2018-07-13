(function () {
  document.addEventListener('DOMContentLoaded', function (event) {

    var submitType = document.querySelector('input[type=submit]')

    if (submitType != null) {
      submitType.addEventListener('dblclick', function (event) {
        event.preventDefault()
      })
    }g

  })

})()
