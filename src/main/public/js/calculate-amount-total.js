$(document).ready(function () {
  numeral.locale('en-gb')

  const updateTotal = function () {
    var total = $('input.claim-amount-column-2')
      .map(toNumber)
      .get()
      .reduce(sum)

    $('#totalSum').text(numeral(total).format('$0,0.00'))

    return true
  }

  $('input.claim-amount-column-2').keyup(updateTotal)

  function toNumber (index, inputElement) {
    var parsed = parseFloat($(inputElement).val())
    if (isNaN(parsed)) {
      return 0
    } else {
      return parsed
    }
  }

  function sum (accumulator, currentValue) {
    return accumulator + currentValue
  }

  updateTotal();
})
