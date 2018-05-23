$(document).ready(function () {

  $('input[name="paymentSchedule"]').click(function () {

    //need total amount claimed to calculate length of payment
    //how do i get total amount claimed to use here?
    var instalmentAmount = $('#instalmentAmount').val()

    function calculateLengthOfPayment(paymentScheduleVal) {
      //wrong calculation - to be corrected
      return Math.ceil(instalmentAmount/paymentScheduleVal)
    }

    //exact calculation still to be worked on
    /*
    total claim amount = 1000
    regular payments = 50
    if each week --> 1000/50 = 20 instalments = 20 weeks
    if every two weeks --> 1000/50 = 20 instalments = 40 weeks
    if every month --> 1000/50 = 20 instalments = 20 months

     */
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
