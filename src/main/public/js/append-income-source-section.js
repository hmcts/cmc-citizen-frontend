$(document).ready(function () {
  var feature = (function () {
    var config = {
      //selectors
      addOtherIncomeSourceButton: 'input[name="action[addOtherIncomeSource]"]',
      otherIncomeExpenseSourceSection: '.other-income-expense-source'
    }

    var init = function (settings) {
      $.extend(config, settings);

      addOtherIncomeSourceButtonElement = $(config.addOtherIncomeSourceButton);
      otherIncomeExpenseSourceSectionElement = $(config.otherIncomeExpenseSourceSection);

      setup();

    };

    var setup = function () {
      addOtherIncomeSourceButtonElement.keyup(addNewOtherIncome);
      otherIncomeExpenseSourceSectionElement.change();
    }

    var addNewOtherIncome = function () {

    }

    return {
      init: init
    };
  })();

  feature.init();
});
