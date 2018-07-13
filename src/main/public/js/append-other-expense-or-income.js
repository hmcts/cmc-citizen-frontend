(function () {
  document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelector('.otherSection input.button')
      .addEventListener('click', function (event) {
        event.preventDefault()
        console.log('clicked add another')
      })

    document.querySelectorAll('.otherSection input.link-button')
      .forEach(function (removeOtherElement) {
        removeOtherElement.addEventListener('click', function (event) {
          event.preventDefault()
          console.log('clicked remove another')
        })
      })

  })
})()
