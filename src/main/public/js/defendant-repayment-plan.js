
$(document).ready(function () {

  $('input[name="paymentSchedule"]').click(function () {

    var remainingAmount = $('input[name="remainingAmount"]').val()
    var instalmentAmount = $('#instalmentAmount').val()

    function calculateHowManyInstalments() {
      return Math.ceil(remainingAmount/instalmentAmount)
    }

    function cal(days) {
      var numberOfDaysToPay = calculateHowManyInstalments() * days
      var finalPaidDay = moment().add(numberOfDaysToPay,'days')
      console.log(finalPaidDay)
      console.log(finalPaidDay.diff( moment(), 'years'))
      console.log(finalPaidDay.diff( moment(), 'months'))
      console.log(finalPaidDay.diff( moment(), 'weeks'))
    }

    switch ($(this).attr('id')) {
      case 'paymentScheduleEACH_WEEK':
        $('#lengthOfRepayment').text(cal(7))
        break;
      case 'paymentScheduleEVERY_TWO_WEEKS':
        $('#lengthOfRepayment').text(cal(14))
        break;
      case 'paymentScheduleEVERY_MONTH':
        $('#lengthOfRepayment').text(cal(30))
        break;
    }
  })
})


/*
total claim amount = 1000
regular payments = 50
if each week --> 1000/50 = 20 instalments = 20 * 7 = 140 days
if every two weeks --> 1000/50 = 20 instalments = 20 * 14 = 280 days
if every month --> 1000/50 = 20 instalments = 20 * 30 = 600 days
*/
