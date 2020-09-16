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
        return 'rows[' + (parseInt(capturedRowIndex) + 1) + ']'
      })
    })
    newRow.html(function (index, oldHtml) {
      return oldHtml.replace('<label class="form-label-bold mobile-show visually-hidden" for="rows['+ newIndex +'][reason]">'+ newIndex +' . What you’re claiming for</label>',
        function (match, capturedRowIndex) {
          return '<label class="form-label-bold mobile-show visually-hidden" for="rows['+ newIndex +'][reason]">'+ (parseInt(newIndex) + 1) +' . What you’re claiming for</label>'
        })
    })
    newRow.html(function (index, oldHtml) {
      return oldHtml.replace('<label class="form-label-bold mobile-show visually-hidden" for="rows['+ newIndex +'][amount]">'+ newIndex +' . Amount</label>',
        function (match, capturedRowIndex) {
          return '<label class="form-label-bold mobile-show visually-hidden" for="rows['+ newIndex +'][amount]">'+ (parseInt(newIndex) + 1) +' . Amount</label>'
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
