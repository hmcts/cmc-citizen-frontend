$(document).ready(function () {
  var feature = (function () {
    var config = {
      //selectors
      addIncomeExpenseSource: 'input[name="action[addOtherIncomeSource]"]',
      otherIncomeExpenseSource: '.other-income-expense-source'
    }

    var init = function (settings) {
      $.extend(config, settings);

      $(config.addIncomeExpenseSource).click(function () {
        var lastRow = $(config.otherIncomeExpenseSource).last()
        var newRow = lastRow.clone()

        lastRow.parent().append(newRow)
      })
    };

    return {
      init: init
    };
  })();

  feature.init();

  // $('input[name="action[addOtherIncomeSource]"]').click(function () {
  //   var lastRow = $('.panel panel-border-narrow expandable').last()
  //   var newRow = lastRow.clone()
  //
  //   lastRow.parent().append(newRow)
  //
  //   return false
  // })

});
