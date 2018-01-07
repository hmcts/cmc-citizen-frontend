(function () {
  var PostcodeLookup = function() {
    var widget
    var searchContainer
    var searchButton
    var addressDropdownContainer
    var addressDropdown
    var addressContainer
    var enterAddressManuallyLink

    // Private methods

    function show(element) {
      element.classList.remove('hidden', 'js-hidden')
    }

    function hide(element) {
      element.classList.add('hidden')
    }

    function showError (errorCode) {
      widget.querySelectorAll('.search-error').forEach(function (errorMessage) {
        errorMessage.classList.add('hidden')
      })

      widget.querySelector('.search-error.' + errorCode.toLowerCase().replace(/_/g, '-')).classList.remove('hidden')
      widget.querySelector('.postcode-search-container').classList.add('form-group-error')
    }

    function clearErrors () {
      widget.querySelectorAll('.form-group-error').forEach(function (element) {
        element.classList.remove('form-group-error')
      })
      widget.querySelectorAll('.form-control-error').forEach(function (element) {
        element.classList.remove('form-control-error')
      })
      widget.querySelectorAll('.error-message').forEach(function (element) {
        element.remove()
      })
      widget.querySelectorAll('.search-error').forEach(function (element) {
        element.classList.add('hidden')
      })
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

    function lookupPostcode (postcode) {
      if (!postcode || postcode.trim().length === 0) {
        showError('MISSING_POSTCODE_ERROR')
        return
      }

      clearErrors()

      var xhr = new XMLHttpRequest()
      xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
      xhr.onload = function () {
        if (xhr.status !== 200) {
          showError('UNKNOWN_ERROR')
          return
        }

        var result = JSON.parse(xhr.responseText)

        if (!result.valid) {
          function isNorthernIrelandPostcode (postcode) {
            return postcode.startsWith('BT')
          }

          showError(isNorthernIrelandPostcode(postcode) ? 'UNSUPPORTED_POSTCODE_ERROR' : 'UNKNOWN_ERROR')
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

        show(addressDropdownContainer)
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

          hide(addressDropdownContainer)
          hide(addressContainer)
          show(enterAddressManuallyLink)
          lookupPostcode(this.previousElementSibling.value)
        })

        show(searchContainer)
      }

      function initAddressSelectionCapability () {
        addressDropdownContainer = element.querySelector('.postcode-address-picker')

        addressDropdown = element.querySelector('.postcode-select')
        addressDropdown.addEventListener('change', function () {
          var address = this.value.split(', ')
          setAddress({
            line1: address[0],
            line2: address[1],
            city: address[2],
            postcode: address[3]
          })
          show(addressContainer)
          hide(enterAddressManuallyLink)
        })
      }

      function initEnterAddressManuallyCapability () {
        enterAddressManuallyLink = element.querySelector('.enter-address-manually-link')
        enterAddressManuallyLink.addEventListener('click', function () {
          setAddress(undefined)
          show(addressContainer)
          hide(enterAddressManuallyLink)
        })
        show(enterAddressManuallyLink)
      }

      function restoreState() {
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
          show(addressContainer)
          hide(enterAddressManuallyLink)
        }
      }

      initPostcodeSearchCapability()
      initAddressSelectionCapability()
      initEnterAddressManuallyCapability()

      addressContainer = element.querySelector('.address')
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
