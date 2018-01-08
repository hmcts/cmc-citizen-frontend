(function () {
  var PostcodeLookup = function() {
    var widget
    var searchContainer
    var searchButton
    var addressDropdownContainer
    var addressDropdown
    var addressContainer
    var enterAddressManuallyLink
    var stateHolder

    var State = {
      PRISTINE: 'PRISTINE',
      ADDRESS_FOUND: 'ADDRESS_FOUND',
      ADDRESS_ENTERED: 'ADDRESS_ENTERED'
    }

    var Error = {
      MISSING_POSTCODE_ERROR: 'MISSING_POSTCODE_ERROR',
      UNSUPPORTED_POSTCODE_ERROR: 'UNSUPPORTED_POSTCODE_ERROR',
      MISSING_ADDRESS_ERROR: 'MISSING_ADDRESS_ERROR',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    }

    // Private methods

    function show(element) {
      element.classList.remove('hidden', 'js-hidden')
    }

    function hide(element) {
      element.classList.add('hidden')
    }

    function showError (errorCode, global) {
      var error = widget.querySelector('.js-error.' + errorCode.toLowerCase().replace(/_/g, '-'));
      show(error)

      var formGroup = error.closest('.form-group');
      formGroup.classList.add('form-group-error')
      formGroup.querySelector('input,select').classList.add('form-control-error')

      if (global) {
        var globalErrors = document.querySelector('.error-summary-list')

        var errorLink = document.createElement("a")
        errorLink.href = '#' + error.dataset.label
        errorLink.textContent = error.textContent.trim()

        var globalError = document.createElement("li")
        globalError.appendChild(errorLink)
        globalErrors.appendChild(globalError)
      }
    }

    function clearErrors (global) {
      widget.querySelectorAll('.form-group-error,.form-control-error').forEach(function (element) {
        element.classList.remove('form-group-error', 'form-control-error')
      })
      addressContainer.querySelectorAll('.error-message').forEach(function (element) {
        element.remove()
      })
      widget.querySelectorAll('.js-error').forEach(function (element) {
        hide(element)
      })

      if (global) {
        var globalErrors = document.querySelector('.error-summary-list')
        addressContainer.querySelectorAll('label').forEach(function (label) {
          globalErrors.querySelector('li a[href="#' + label.id  + '"]').remove()
        })
      }
    }

    function setAddress (address) {
      function getValueOrEmpty(property) {
        if (address === undefined) {
          return ''
        }
        return address[property]
      }

      addressContainer.querySelector('.address-line1').value = getValueOrEmpty('line1')
      addressContainer.querySelector('.address-line2').value = getValueOrEmpty('line2')
      addressContainer.querySelector('.address-town-or-city').value = getValueOrEmpty('city')
      addressContainer.querySelector('.postcode').value = getValueOrEmpty('postcode')
    }

    function setUserInterfaceState (state) {
      switch (state) {
        case State.PRISTINE:
          hide(addressDropdownContainer)
          hide(addressContainer)
          setAddress(undefined)
          show(enterAddressManuallyLink)
          break
        case State.ADDRESS_FOUND:
          show(addressDropdownContainer)
          break
        case State.ADDRESS_ENTERED:
          show(addressContainer)
          hide(enterAddressManuallyLink)
          break
      }

      stateHolder.value = state
    }

    function lookupPostcode (postcode) {
      if (!postcode || postcode.trim().length === 0) {
        showError(Error.MISSING_POSTCODE_ERROR)
        return
      }

      var xhr = new XMLHttpRequest()
      xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
      xhr.onload = function () {
        if (xhr.status !== 200) {
          showError(Error.UNKNOWN_ERROR)
          return
        }

        var result = JSON.parse(xhr.responseText)

        if (!result.valid) {
          function isNorthernIrelandPostcode (postcode) {
            return postcode.startsWith('BT')
          }

          showError(isNorthernIrelandPostcode(postcode) ? Error.UNSUPPORTED_POSTCODE_ERROR : Error.UNKNOWN_ERROR)
          return
        }

        var nonSelectableOption = document.createElement("option")
        nonSelectableOption.text = result.addresses.length + ' addresses found'
        nonSelectableOption.disabled = true
        nonSelectableOption.selected = true
        addressDropdown.appendChild(nonSelectableOption)

        result.addresses.forEach(function (address) {
          var valueFormattedAddress = [
            (address.organisationName || address.subBuildingName) + ' ' + (address.buildingNumber || address.buildingName || undefined),
            address.thoroughfareName || address.dependentLocality,
            address.postTown,
            address.postcode
          ].join(', ')

          var option = document.createElement('option')
          var formattedAddress = address.formattedAddress.replace(/\r?\n|\r/g, ', ')
          option.value = valueFormattedAddress
          option.text = formattedAddress
          addressDropdown.appendChild(option)
        })

        setUserInterfaceState(State.ADDRESS_FOUND)
      }
      xhr.send()
    }

    // Public methods

    PostcodeLookup.prototype.init = function (element) {
      function initPostcodeSearchCapability () {
        searchContainer = element.querySelector('.postcode-search-container')

        searchButton = searchContainer.querySelector('.postcode-search')
        searchButton.addEventListener('click', function (event) {
          event.preventDefault()

          clearErrors()
          setUserInterfaceState(State.PRISTINE)
          lookupPostcode(this.previousElementSibling.value)
        })
        show(searchContainer)
      }

      function initAddressSelectionCapability () {
        addressDropdownContainer = element.querySelector('.address-picker-container')

        addressDropdown = element.querySelector('.postcode-select')
        addressDropdown.addEventListener('change', function () {
          clearErrors()
          var address = this.value.split(', ')
          setAddress({
            line1: address[0],
            line2: address[1],
            city: address[2],
            postcode: address[3]
          })
          setUserInterfaceState(State.ADDRESS_ENTERED)
        })
      }

      function initEnterAddressManuallyCapability () {
        enterAddressManuallyLink = element.querySelector('.enter-address-manually-link')
        enterAddressManuallyLink.addEventListener('click', function (event) {
          event.preventDefault()

          clearErrors()
          setAddress(undefined)
          hide(addressDropdownContainer)
          setUserInterfaceState(State.ADDRESS_ENTERED)
        })
        show(enterAddressManuallyLink)
      }

      function restoreState() {
        if (!stateHolder.value) {
          function isAnyAddressFieldPopulated () {
            var result = false
            addressContainer.querySelectorAll('input').forEach(function (input) {
              if (input.value !== '') {
                result = true
              }
            })
            return result
          }

          if (isAnyAddressFieldPopulated()) {
            setUserInterfaceState(State.ADDRESS_ENTERED)
          } else {
            setUserInterfaceState(State.PRISTINE)
          }
          return
        }

        switch (stateHolder.value) {
          case State.PRISTINE:
            clearErrors(true)
            showError(Error.MISSING_POSTCODE_ERROR, true)
            return
          case State.ADDRESS_FOUND:
            clearErrors(true)
            showError(Error.MISSING_ADDRESS_ERROR, true)
            lookupPostcode(searchContainer.querySelector('input').value)
            return
          case State.ADDRESS_ENTERED:
            show(addressContainer)
            hide(enterAddressManuallyLink)
            return
        }
      }

      initPostcodeSearchCapability()
      initAddressSelectionCapability()
      initEnterAddressManuallyCapability()

      addressContainer = element.querySelector('.address')
      stateHolder = element.querySelector('input.state-holder')
      widget = element

      restoreState()
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.postcode-lookup').forEach(function(element) {
      new PostcodeLookup().init(element)
    })
  })
})()
