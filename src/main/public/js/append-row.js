$(document).ready(function () {
  $('input[name="action[addRow]"]').click(function () {
    var lastRow = $('.claim-amount-row, .multiline-row').last()
    var newRow = lastRow.clone()

    incrementDomNodesIds(newRow)
    sanitizeContent(newRow)

    lastRow.parent().append(newRow)

    return false
  })

  function incrementDomNodesIds(newRow) {
    var newIndex = 0
    newRow.html(function (index, oldHtml) {
      return oldHtml.replace(/rows\[(\d+)\]/g, function (match, capturedRowIndex) {
        if (parseInt(capturedRowIndex) === 99) {
          removeEventButton()
        }
        newIndex = parseInt(capturedRowIndex) + 1
        newRowIndex = parseInt(capturedRowIndex) + 2
        return 'rows[' + (parseInt(capturedRowIndex) + 1) + ']'
      })
    })
    newRow.html(function (index, oldHtml) {
      return oldHtml.replace('<label for="rows['+ newIndex +'][reason]"><span class="visually-hidden"> '+ newIndex +'. What you’re claiming for </span></label>',
        function (match, capturedRowIndex) {
          return '<label for="rows['+ newIndex +'][reason]"><span class="visually-hidden"> '+ newRowIndex +'. What you’re claiming for </span></label>'
        })
    })
    newRow.html(function (index, oldHtml) {
      return oldHtml.replace('<label for="rows['+ newIndex +'][amount]"><span class="visually-hidden"> '+ newIndex +'. Amount </span></label>',
        function (match, capturedRowIndex) {
          return '<label for="rows['+ newIndex +'][amount]"><span class="visually-hidden"> '+ newRowIndex +'. Amount </span></label>'
        })
    })
  }

  function sanitizeContent(newRow) {
    newRow.find('input, textarea').val('')

    newRow.removeClass('form-group-error')
    newRow.find('*').removeClass('form-control-error')
    newRow.find('.error-message').remove()
  }

  function removeEventButton() {
    $('input[name="action[addRow]"]').remove()
  }
})
