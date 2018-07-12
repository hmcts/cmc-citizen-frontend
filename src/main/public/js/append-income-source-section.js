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
      addOtherIncomeSourceButtonElement.click(addNewOtherIncome);
    }

    var addNewOtherIncome = function () {
      console.log('this is a test')
      var newOtherIncomeSection = otherIncomeExpenseSourceSectionElement.clone()
      console.log(newOtherIncomeSection)
      otherIncomeExpenseSourceSectionElement.parent().append(newOtherIncomeSection)
    }

    return {
      init: init
    };
  })();

  feature.init();
});


// var lastRow = $('.panel panel-border-narrow expandable').last()
// var newRow = lastRow.clone()
//
// lastRow.parent().append(newRow)
