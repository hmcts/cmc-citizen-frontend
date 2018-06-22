$(document).ready(function () {
  var feature = (function () {
    var config = {
      // Default selectors
      containerSelector: '.expandible-checkbox-option',

      headerSelector: '.expandible.heading-medium',
      checkboxSelector: '.expandible.multiple-choice',
      panelSelector: '.expandible.panel'
    }

    var init = function (settings) {
      // Allow overriding the default config
      $.extend(config, settings);

      $(config.containerSelector).each(function() {
        new Container($(this)).setup();
      });
    };

    // Private constructor function
    function Container (containerElement) {
      this.headerElement = containerElement.find(config.headerSelector);
      this.checkboxElement = containerElement.find(config.checkboxSelector);
      this.panelElement = containerElement.find(config.panelSelector);

      this.setup = function () {
        enableProgressiveEnhancement.call(this);
        bindClearPanelInputFieldsWhenUnchecking.call(this);
      }
      
      // Private
      var enableProgressiveEnhancement = function() {
        this.headerElement.remove()
        this.checkboxElement.removeClass('visually-hidden')
        if (!isChecked.call(this)) {
          this.panelElement.addClass('js-hidden')
        }
      }
  
      // Private
      var bindClearPanelInputFieldsWhenUnchecking = function() {
        var inputFieldElements = this.panelElement.find('input');
        this.checkboxElement.find('input').change(function () {
          if (!this.checked) {
            inputFieldElements.val('');
            inputFieldElements.prop('checked', false);
          }
        })
      }

      // Private
      var isChecked = function () {
        return !!this.checkboxElement.find('input').attr('checked');
      }
    }

    return {
      init: init
    };
  })();

  feature.init();
});
