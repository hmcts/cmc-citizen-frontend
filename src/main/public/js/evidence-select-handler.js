$(document).ready(function () {
  $('.multiline-row .form-control-select').on('change', function () {

    var $content = $(this).next()

    $content
      .find('.evidence-message')
      .addClass('hidden')
    $content
      .find('textarea')
      .val('')

    if (this.value) {
      $content
        .removeClass('js-hidden')
      $content
        .find('.evidence-message-' + this.value)
        .removeClass('hidden')
    } else {
      $content
        .addClass('js-hidden')
    }
  })
})
