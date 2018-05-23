$(document).ready(function () {

  $('input[name="paymentSchedule"]').click(function () {

    var instalmentAmount = $('#instalmentAmount').val()

    function calculateLengthOfPayment(paymentScheduleVal) {
      return Math.ceil(instalmentAmount/paymentScheduleVal)
    }

    switch ($(this).attr('id')) {
      case 'paymentScheduleEACH_WEEK':
        $('#lengthOfRepayment').text(calculateLengthOfPayment(7))
        break;
      case 'paymentScheduleEVERY_TWO_WEEKS':
        $('#lengthOfRepayment').text(calculateLengthOfPayment(14))
        break;
      case 'paymentScheduleEVERY_MONTH':
        $('#lengthOfRepayment').text(calculateLengthOfPayment(30))
        break;
    }
  })
})
