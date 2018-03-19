$(document).ready(function () {
  var focusTarget = $('#focus-target').val()
  if (focusTarget) {
    $('input[name="' + focusTarget + '"]').focus()
  }
})
