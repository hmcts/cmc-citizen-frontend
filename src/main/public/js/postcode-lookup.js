(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-visible')
      .forEach(function (hiddenElement) {
        hiddenElement.classList.remove('hidden')
      })

    allPostcodeLookupWidgets()
      .forEach(function (postcodeLookupWidget) {
        postcodeSearchButton(postcodeLookupWidget)
          .addEventListener('click', function (event) {
            event.preventDefault()

            clearPostcodeDropdown(postcodeLookupWidget)
            hidePostcodeDropdown(postcodeLookupWidget)
            clearAddressFields(postcodeLookupWidget)
            hideAddressEntry(postcodeLookupWidget)
            lookupPostcode(this.previousElementSibling.value, postcodeLookupWidget)
          })

        postcodeDropdown(postcodeLookupWidget)
          .addEventListener('change', function () {
            var addressDetails = this.value.split(', ')
            var addressElement = postcodeLookupWidget.querySelector('.address')
            addressLine1(addressElement).value = addressDetails[0]
            addressLine2(addressElement).value = addressDetails[1]
            addressTownOrCity(addressElement).value = addressDetails[2]
            addressPostcode(addressElement).value = addressDetails[3]
            showAddressEntry(postcodeLookupWidget)
            cleanAddressErrors(postcodeLookupWidget)
            hideEnterAddressManuallyLink(postcodeLookupWidget)
          })

        enterAddressManuallyLink(postcodeLookupWidget)
          .addEventListener('click', function (event) {
            event.preventDefault()

            showAddressEntry(postcodeLookupWidget)
            this.classList.add('js-hidden')
          })

        if (isAnyAddressFieldPopulated(postcodeLookupWidget) || isAnyAddressFieldInvalid(postcodeLookupWidget)) {
          showAddressEntry(postcodeLookupWidget)
          hideEnterAddressManuallyLink(postcodeLookupWidget)
        } else {
          enterAddressManuallyLink(postcodeLookupWidget)
            .classList.remove('hidden')
        }
      })

    document.querySelector('#saveAndContinue')
      .addEventListener('click', function (event) {
        var allAddressesVisible = true

        allPostcodeLookupWidgets()
          .forEach(function (postcodeLookupWidget) {
            if (addressSection(postcodeLookupWidget).classList.contains('js-hidden')) {
              var wrappingPanel = postcodeLookupWidget.closest('.panel')

              if (!wrappingPanel || !wrappingPanel.classList.contains('js-hidden')) {
                allAddressesVisible = false
              }
            }
          })

        if (!allAddressesVisible) {

          event.preventDefault()
        }
      })
  })

  function postcodeSearchButton(postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-search')
  }

  function allPostcodeLookupWidgets () {
    return document.querySelectorAll('.postcode-lookup')
  }

  function isNorthernIrelandPostcode (postcode) {
    return postcode.startsWith('BT')
  }

  function addressSection (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.address')
  }

  function postcodeAddressPicker (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-address-picker')
  }

  function postcodeDropdown (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-select')
  }

  function addressLine1 (addressElement) {
    return addressElement.querySelector('.address-line1')
  }

  function addressLine2 (addressElement) {
    return addressElement.querySelector('.address-line2')
  }

  function addressTownOrCity (addressElement) {
    return addressElement.querySelector('.address-town-or-city')
  }

  function addressPostcode (addressElement) {
    return addressElement.querySelector('.postcode')
  }

  function showAddressEntry (postcodeLookupWidget) {
    addressSection(postcodeLookupWidget).classList.remove('js-hidden')
  }

  function hideAddressEntry (postcodeLookupWidget) {
    addressSection(postcodeLookupWidget).classList.add('js-hidden')
  }

  function enterAddressManuallyLink (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-enter-manually')
  }

  function hideEnterAddressManuallyLink (postcodeLookupWidget) {
    enterAddressManuallyLink(postcodeLookupWidget).classList.add('js-hidden')
  }

  function clearPostcodeDropdown (postcodeLookupWidget) {
    postcodeDropdown(postcodeLookupWidget).innerHTML = ''
  }

  function hidePostcodeDropdown (postcodeLookupWidget) {
    postcodeAddressPicker(postcodeLookupWidget).classList.add('hidden')
  }

  function showPostcodeDropdown (postcodeLookupWidget) {
    postcodeAddressPicker(postcodeLookupWidget).classList.remove('hidden')
  }

  function clearAddressFields (postcodeLookupWidget) {
    var addressElement = addressSection(postcodeLookupWidget)
    addressLine1(addressElement).value = ''
    addressLine2(addressElement).value = ''
    addressTownOrCity(addressElement).value = ''
    addressPostcode(addressElement).value = ''
  }

  function isAnyAddressFieldPopulated (postcodeLookupWidget) {
    var addressElement = addressSection(postcodeLookupWidget)

    return addressLine1(addressElement).value !== '' ||
      addressLine2(addressElement).value !== '' ||
      addressTownOrCity(addressElement).value !== '' ||
      addressPostcode(addressElement).value !== ''
  }

    function isAnyAddressFieldInvalid (postcodeLookupWidget) {
    var addressElement = addressSection(postcodeLookupWidget)

    return addressLine1(addressElement).classList.contains('form-control-error') ||
      addressLine2(addressElement).classList.contains('form-control-error') ||
      addressTownOrCity(addressElement).classList.contains('form-control-error') ||
      addressPostcode(addressElement).classList.contains('form-control-error')
  }

  function showAddressError (errorCode, postcodeLookupWidget) {
    postcodeLookupWidget.querySelectorAll('.search-error').forEach(function (errorMessageSelector) {
      errorMessageSelector.classList.add('hidden')
    })

    postcodeLookupWidget.querySelector('.search-error.' + errorCode.toLowerCase().replace(/_/g, '-')).classList.remove('hidden')
    postcodeLookupWidget.querySelector('.postcode-search-container').classList.add('form-group-error')
  }

  function cleanAddressErrors (postcodeLookupWidget) {
    addressSection(postcodeLookupWidget).querySelectorAll('.form-group-error').forEach(function (group) {
      group.classList.remove('form-group-error')
      group.querySelectorAll('input.form-control').forEach(function (input) {
        input.classList.remove('form-control-error')
      })
      group.querySelectorAll('span.error-message').forEach(function (span) {
        span.remove()
      })
    })
  }

  function lookupPostcode (postcode, postcodeLookupWidget) {
    if (!postcode || postcode.trim().length === 0) {
      showAddressError('MISSING_POSTCODE_ERROR', postcodeLookupWidget)
      return
    }

    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
    xhr.onload = function () {
      if (xhr.status !== 200) {
        showAddressError('UNKNOWN_ERROR', postcodeLookupWidget)
        showAddressEntry(postcodeLookupWidget)
        hideEnterAddressManuallyLink(postcodeLookupWidget)
        return
      }

      var postcodeResponse = JSON.parse(xhr.responseText)

      if (!postcodeResponse.valid) {
        var ni = isNorthernIrelandPostcode(postcode)
        showAddressError(ni ? 'UNSUPPORTED_POSTCODE_ERROR' : 'UNKNOWN_ERROR', postcodeLookupWidget)
        showAddressEntry(postcodeLookupWidget)
        hideEnterAddressManuallyLink(postcodeLookupWidget)
        return
      }

      var postcodeSelectDropdown = postcodeLookupWidget.querySelector('select')

      var nonSelectableOption = document.createElement("option")
      nonSelectableOption.text = postcodeResponse.addresses.length + ' addresses found'
      nonSelectableOption.disabled = true
      nonSelectableOption.selected = true
      postcodeSelectDropdown.appendChild(nonSelectableOption)

      postcodeResponse.addresses.forEach(function (address) {
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
        postcodeSelectDropdown.appendChild(option)
      })

      showPostcodeDropdown(postcodeLookupWidget)
      postcodeLookupWidget.querySelector('.postcode-search-container')
        .classList.remove('form-group-error')
      postcodeLookupWidget.querySelectorAll('.search-error').forEach(function (errorMessageSelector) {
        errorMessageSelector.classList.add('hidden')
      })

    }
    xhr.send()
  }
})()
