$(document).ready(function () {
  $('.timeline-row .form-control-select').on('change', function () {

    var $content = $(this).next()

    if (this.value) {
      $content.removeClass('js-hidden')
        .attr('aria-hidden', 'true').attr('aria-expanded', 'false')
      $content.find('textarea').val('')
      $content.find('.evidence-message').addClass('visually-hidden')
      $content.find('.evidence-message-' + this.value).removeClass('visually-hidden')
    } else {
      $content.addClass('js-hidden')
        .attr('aria-hidden', 'true').attr('aria-expanded', 'true')
      $content.find('.evidence-message')
        .html('')
        .addClass('visually-hidden')
    }
  })
})
