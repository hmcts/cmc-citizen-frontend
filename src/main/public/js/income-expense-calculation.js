$(document).ready(function () {
  var feature = (function () {
    var config = {
      // Default selectors
      containerSelector: '.income-expense-calculation',

      panelSelector: '.expandible-checkbox-option .expandible.panel',
      inputFieldSelector: 'input[name*=amount],input:checked[name*=schedule]',
      totalMonthlyIncomeExpenseSelector: 'total-monthly-income-expense',

      amountType: 'amount',
      scheduleType: 'schedule'
    }

    var containerElement = null;

    var setTotalMonthlyIncomeExpense = function (totalAmount) {
      totalMonthlyIncomeExpenseElement.text(totalAmount);
    }

    var init = function (settings) {
      // Allow overriding the default config
      $.extend(config, settings);

      containerElement = $(config.containerSelector);
    
      console.log('output: ', removeInvalidFormDataEntries(extractFormData()));

      setup();
    };

    var setup = function () {
    }

    var extractFormData = function() {
      var formData = [];

      containerElement
        .find(config.panelSelector)
        .find(config.inputFieldSelector)
        .each(function() {
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
