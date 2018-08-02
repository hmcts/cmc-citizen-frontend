$(document).ready(function () {
  $('.multiline-rows').on('change', '.multiline-row .form-control-select', function (event) {
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
