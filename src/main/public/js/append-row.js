$(document).ready(function () {
  $('input[name="action[addRow]"]').click(function () {
    var lastRow = $('.claim-amount-row, .multiline-row').last()
    var parent = lastRow.parent()
    var newRow = lastRow.clone()
    newRow.html(incrementDomNodesIds)
    newRow.find('input, textarea').val('')
    parent.append(newRow)
    return false
  })

  function incrementDomNodesIds (index, oldHtml) {
    return oldHtml.replace(/rows\[(\d+)\]/g, function (match, capturedRowIndex) {
      return 'rows[' + (parseInt(capturedRowIndex) + 1) + ']'
    })
  }
})
