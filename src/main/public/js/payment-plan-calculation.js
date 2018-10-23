$(document).ready(function () {
  var feature = (function () {
    var config = {
      paymentLengthCalculationApi: '/payment-plan-calculation',
      noPaymentLengthPlaceholder: '-',

      // Default selectors
      containerSelector: '.payment-plan-calculation',
      totalAmountSelector: 'input[name=totalAmount]',
      instalmentAmountSelector: 'input[name=instalmentAmount]',
      paymentSchedultSelector: 'input[name=paymentSchedule]',
      calculatePaymentLengthButton: '.calculateLengthOfRepayment',
      paymentLengthSelector: '.lengthOfRepayment'
    }

    var containerElement = null;

    var totalAmountElement = null;
    var instalmentAmountElement = null;
    var paymentScheduleElement = null;
    var calculatePaymentLengthButtonElement = null;
    var paymentLengthElement = null;

    var getTotalAmount = function () {
      return totalAmountElement.val();
    }

    var getInstalmentAmount = function () {
      return instalmentAmountElement.val();
    }

    var getPaymentSchedule = function () {
      return containerElement.find(config.paymentSchedultSelector + ':checked').val();
    }

    var setPaymentLength = function (paymentLength) {
      paymentLengthElement.text(paymentLength);
    }

    var init = function (settings) {
      // Allow overriding the default config
      $.extend(config, settings);

      containerElement = $(config.containerSelector);

      totalAmountElement = containerElement.find(config.totalAmountSelector);
      instalmentAmountElement = containerElement.find(config.instalmentAmountSelector);
      paymentScheduleElement = containerElement.find(config.paymentSchedultSelector);
      calculatePaymentLengthButtonElement = containerElement.find(config.calculatePaymentLengthButton);
      paymentLengthElement = containerElement.find(config.paymentLengthSelector);

      setup();
    };

    var setup = function () {
      enableProgressiveEnhancement();
      instalmentAmountElement.keyup(updatePaymentLength);
      paymentScheduleElement.change(updatePaymentLength);
    }

    var enableProgressiveEnhancement = function() {
      calculatePaymentLengthButtonElement.remove();
    }

    var updatePaymentLength = function() {
      var totalAmount = getTotalAmount();
      var instalmentAmount = getInstalmentAmount();
      var frequencyInWeeks = mapFrequencyInWeeks(getPaymentSchedule());

      if (!totalAmount || !instalmentAmount || !frequencyInWeeks) {
        setPaymentLength(config.noPaymentLengthPlaceholder);
        return
      }
      callPaymentPlanCalculationEndpoint(getTotalAmount, getInstalmentAmount, frequencyInWeeks);
    }

    var callPaymentPlanCalculationEndpoint = function (totalAmount, instalmentAmount, frequencyInWeeks) {
      var parameters = {
        'total-amount': totalAmount,
        'instalment-amount': instalmentAmount,
        'frequency-in-weeks': frequencyInWeeks
      }
      $.getJSON({
        url: buildApiPath(parameters),
        success: paymentPlanCalculationHandler
      })
    }

    var paymentPlanCalculationHandler = function (data) {
      var paymentPlan = data.paymentPlan || {};
      setPaymentLength(paymentPlan.paymentLength || config.noPaymentLengthPlaceholder);
    }

    var buildApiPath = function (parameters) {
      return config.paymentLengthCalculationApi + '?' + $.param(parameters)
    }

    var mapFrequencyInWeeks = function(frequency) {
      switch (frequency) {
        case 'EACH_WEEK':
          return 1.0;
        case 'EVERY_TWO_WEEKS':
          return 2.0;
        case 'EVERY_MONTH':
          return 52/12;
        default:
          return undefined;
      }
    }

    return {
      init: init
    };
  })();

  feature.init();
});
