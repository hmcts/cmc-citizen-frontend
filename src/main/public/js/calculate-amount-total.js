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

  $('#claim-amount').on('keyup','input.claim-amount-column-2', updateTotal)

  function toNumber (index, inputElement) {
    var regex =  /^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/;
    var val = String($(inputElement).val())

    if(!regex.test(val)) {
      return 0
    }
    var parsed = parseFloat(val.replace(/,/g, ''))
    if (isNaN(parsed)) {
      return 0
    }
    return parsed
  }

  function sum (accumulator, currentValue) {
    return accumulator + currentValue
  }

  updateTotal();
})
