$(document).ready(function () {
  var feature = (function () {
    var config = {
      // Default selectors
      containerSelector: '.expandable-checkbox-option',

      // Main selectors
      headerSelector: '.expandable.heading-medium',
      checkboxSelector: '.expandable.multiple-choice',
      panelSelector: '.expandable.panel',

      // Error selectors
      formGroupErrorSelector: '.form-group-error',
      errorMessageSelector: '.error-message',
      formControlErrorSelector: '.form-control-error'
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
        var panelElement = this.panelElement;
        var inputFieldElements = panelElement.find('input');
        this.checkboxElement.find('input').change(function () {
          if (!this.checked) {
            clearValidationErrorMessages(panelElement);
            inputFieldElements.each(function () {
              var inputFieldelement = $(this);

              switch (inputFieldelement.attr('type')) {
                case 'text':
                case 'number':
                  inputFieldelement.val('').change();
                  break;
                case 'radio':
                  inputFieldelement.prop('checked', false).change();
                  break;
              }
            })
          }
        })
      }

      // Private
      var isChecked = function () {
        return !!this.checkboxElement.find('input').attr('checked');
      }

      // Private
      var clearValidationErrorMessages = function(panelElement) {
        panelElement
          .find(config.formGroupErrorSelector)
          .removeClass(config.formGroupErrorSelector.slice(1));
        panelElement
          .find(config.errorMessageSelector)
          .remove();
        panelElement
          .find(config.formControlErrorSelector)
          .removeClass(config.formControlErrorSelector.slice(1));
      }
    }

    return {
      init: init
    };
  })();

  feature.init();
});
