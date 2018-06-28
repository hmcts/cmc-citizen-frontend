$(document).ready(function () {
  var feature = (function () {
    var config = {
      incomeExpenseCalculationApi: '/total-income-expense-calculation',
      noTotalMonthlyIncomeExpense: '0.00',

      // Default selectors
      containerSelector: '.income-expense-calculation',

      panelSelector: '.expandible-checkbox-option .expandible.panel',
      csrfInputFieldSelector: 'input[name=_csrf]',
      amountInputFieldSelector: 'input[name*=amount]',
      scheduleInputFieldSelector: 'input[name*=schedule]',
      formDataFieldSelector: 'input[name*=amount],input:checked[name*=schedule]',
      calculateMontlyIncomeExpenseButtonSelector: '.calculate-montly-income-expense',
      totalMonthlyIncomeExpenseSelector: '.total-monthly-income-expense',

      amountType: 'amount',
      scheduleType: 'schedule'
    }

    var containerElement = null;
    var totalMonthlyIncomeExpenseElement = null;
    var calculateMontlyIncomeExpenseButtonElement = null;

    var getCsrfToken = function () {
      return csrfInputFieldElement.val();
    }

    var setTotalMonthlyIncomeExpense = function (totalAmount) {
      totalMonthlyIncomeExpenseElement.text(totalAmount);
    }

    var init = function (settings) {
      // Allow overriding the default config
      $.extend(config, settings);

      containerElement = $(config.containerSelector);
      csrfInputFieldElement = containerElement.find(config.csrfInputFieldSelector);
      amountInputFieldElement = containerElement.find(config.amountInputFieldSelector);
      scheduleInputFieldElement = containerElement.find(config.scheduleInputFieldSelector);
      calculateMontlyIncomeExpenseButtonElement = containerElement.find(config.calculateMontlyIncomeExpenseButtonSelector);
      totalMonthlyIncomeExpenseElement = containerElement.find(config.totalMonthlyIncomeExpenseSelector);

      setup();
    };

    var setup = function () {
      enableProgressiveEnhancement();
      amountInputFieldElement.keyup(updatePaymentLength);
      scheduleInputFieldElement.change(updatePaymentLength);
    }

    var enableProgressiveEnhancement = function() {
      calculateMontlyIncomeExpenseButtonElement.remove();
    }

    var updatePaymentLength = function () {
      var formData = removeInvalidFormDataEntries(extractFormData());

      if (formData.length < 1) {
        setTotalMonthlyIncomeExpense(config.noTotalMonthlyIncomeExpense);
        return
      }

      var body = {
        incomeExpenseSources: formData
      };

      callPaymentPlanCalculationEndpoint(body);
    }

    var callPaymentPlanCalculationEndpoint = function (body) {
      $.ajax({
        url: config.incomeExpenseCalculationApi,
        type: 'post',
        data: body,
        headers: {
          'csrf-token': getCsrfToken()
        },
        dataType: 'json',
        success: incomeExpenseCalculationHandler
      });
    }

    var incomeExpenseCalculationHandler = function (data) {
      setTotalMonthlyIncomeExpense(data.totalMonthlyIncomeExpense || config.noTotalMonthlyIncomeExpense);
    }

    var extractFormData = function () {
      var formData = [];

      containerElement
        .find(config.panelSelector)
        .find(config.formDataFieldSelector)
        .each(function () {
          var fieldType = deriveFieldTypeFromFieldName(this.name);
          var fieldValue = $(this).val();

          switch (fieldType) {
            case config.amountType:
              var newEntry = {};
              newEntry[config.amountType] = fieldValue;
              formData.unshift(newEntry);
              break;
            case config.scheduleType:
              var existingEntry = formData[0];
              existingEntry[config.scheduleType] = fieldValue;
              break;
          }
        });

      return formData;
    }

    var deriveFieldTypeFromFieldName = function (fieldName) {
      if (fieldName.match(config.amountType)) {
        return config.amountType;
      }
      if (fieldName.match(config.scheduleType)) {
        return config.scheduleType;
      }
      return undefined;
    }

    var removeInvalidFormDataEntries = function (formData) {
      return $.grep(formData, function (entry) {
        return entry[config.amountType] && entry[config.scheduleType]
      })
    }

    return {
      init: init
    };
  })();

  feature.init();
});
