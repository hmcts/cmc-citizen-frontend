(function () {
  document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelectorAll('.js-visible')
      .forEach(function (hiddenElement) {
        hiddenElement.classList.remove('hidden')
      })

    allPostcodeLookupWidgets()
      .forEach(function (postcodeLookupWidget) {
        postcodeLookupWidget.querySelector('.postcode-search')
          .addEventListener('click', function (event) {
            event.preventDefault()

            hide(postcodeAddressPicker(postcodeLookupWidget))
            clearAddressFields(postcodeLookupWidget)
            hide(addressSection(postcodeLookupWidget))
            lookupPostcode(this.previousElementSibling.value, postcodeLookupWidget)
          })

        postcodeLookupWidget.querySelector('.postcode-select')
          .addEventListener('change', function (event) {
            enterManuallyLink(postcodeLookupWidget).classList.add('hidden')

            var addressDetails = this.value.split(', ')
            var addressElement = postcodeLookupWidget.querySelector('.address')
            addressLine1(addressElement).value = addressDetails[0]
            addressLine2(addressElement).value = addressDetails[1]
            addressLine3(addressElement).value = addressDetails[2]
            addressTownOrCity(addressElement).value = addressDetails[3]
            addressPostcode(addressElement).value = addressDetails[4]
            show(addressSection(postcodeLookupWidget))
          })

        enterManuallyLink(postcodeLookupWidget)
          .addEventListener('click', function (event) {
            event.preventDefault()

            show(addressSection(postcodeLookupWidget))
            this.classList.add('hidden')
            enterManuallyHiddenInput(postcodeLookupWidget).value = 'true'
          })

        var anyAddressFieldPopulated = isAnyAddressFieldPopulated(postcodeLookupWidget)
        if (anyAddressFieldPopulated) {
          show(addressSection(postcodeLookupWidget))
        }

        // Show postcode dropdown on postback in case of validation error
        if (postcodeAddressPickerHiddenInput(postcodeLookupWidget).value === 'true' && !anyAddressFieldPopulated) {
          show(postcodeAddressPicker(postcodeLookupWidget))
          lookupPostcode(postcodeSearchButton(postcodeLookupWidget).previousElementSibling.value, postcodeLookupWidget)
        }

        // Show fields if manual entry was previously clicked
        if (enterManuallyHiddenInput(postcodeLookupWidget).value === 'true') {
          show(addressSection(postcodeLookupWidget))
        }

        if (isNotHidden(addressSection(postcodeLookupWidget))) {
          hide(enterManuallyLink(postcodeLookupWidget))
        }
      })

    document.querySelector('#saveAndContinue')
      .addEventListener('click', function (event) {
        allPostcodeLookupWidgets()
          .forEach(function (postcodeLookupWidget) {
            postcodeLookupWidget.querySelector('.postcode-address-visible').value =
              isNotHidden(addressSection(postcodeLookupWidget))

            postcodeLookupWidget.querySelector('.address-selector-visible').value =
              isNotHidden(postcodeAddressPicker(postcodeLookupWidget))
          })
      })
  })

  function show (element) {
    // IE doesn't support multiple arguments to classList
    element.classList.remove('hidden')
    element.classList.remove('js-hidden')
  }

  function hide (element) {
    element.classList.add('hidden')
  }

  function isNotHidden (element) {
    return !(element.classList.contains('js-hidden') || element.classList.contains('hidden'))
  }

  function enterManuallyLink (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-enter-manually')
  }

  function postcodeSearchButton (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-search')
  }

  function allPostcodeLookupWidgets () {
    return document.querySelectorAll('.postcode-lookup')
  }

  function postcodeAddressPickerHiddenInput (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.address-selector-visible')
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
    return postcodeLookupWidget.querySelector('select')
  }

  function addressLine1 (addressElement) {
    return addressElement.querySelector('.address-line1')
  }

  function addressLine2 (addressElement) {
    return addressElement.querySelector('.address-line2')
  }

  function addressLine3 (addressElement) {
    return addressElement.querySelector('.address-line3')
  }

  function addressTownOrCity (addressElement) {
    return addressElement.querySelector('.address-town-or-city')
  }

  function addressPostcode (addressElement) {
    return addressElement.querySelector('.postcode')
  }

  function clearPostcodeDropdown (postcodeLookupWidget) {
    postcodeDropdown(postcodeLookupWidget).innerHTML = ''
  }

  function clearAddressFields (postcodeLookupWidget) {
    var addressElement = addressSection(postcodeLookupWidget)
    addressLine1(addressElement).value = ''
    addressLine2(addressElement).value = ''
    addressLine3(addressElement).value = ''
    addressTownOrCity(addressElement).value = ''
    addressPostcode(addressElement).value = ''
  }

  function isAnyAddressFieldPopulated (postcodeLookupWidget) {
    var addressElement = addressSection(postcodeLookupWidget)

    return addressLine1(addressElement).value !== '' ||
      addressLine2(addressElement).value !== '' ||
      addressLine3(addressElement).value !== '' ||
      addressTownOrCity(addressElement).value !== '' ||
      addressPostcode(addressElement).value !== ''
  }

  function enterManuallyHiddenInput (postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-enter-manually-visible')
  }

  function showAddressError (isNorthernIrelandPostcode, postcodeLookupWidget) {
    var northernIrelandErrorMessage = postcodeLookupWidget.querySelector('.postcode-search-error-ni')
    var genericErrorMessage = postcodeLookupWidget.querySelector('.postcode-search-error')

    if (isNorthernIrelandPostcode) {
      northernIrelandErrorMessage.classList.remove('hidden')
      genericErrorMessage.classList.add('hidden')
    } else {
      northernIrelandErrorMessage.classList.add('hidden')
      genericErrorMessage.classList.remove('hidden')
    }

    postcodeLookupWidget.querySelector('.postcode-search-container').classList.add('form-group-error')
  }

  function hideAddressError (postcodeLookupWidget) {
    var northernIrelandErrorMessage = postcodeLookupWidget.querySelector('.postcode-search-error-ni')
    var genericErrorMessage = postcodeLookupWidget.querySelector('.postcode-search-error')

    hide(northernIrelandErrorMessage)
    hide(genericErrorMessage)

    postcodeLookupWidget.querySelector('.postcode-search-container').classList.remove('form-group-error')
  }

  function handlePostcodeError (isNorthernIrelandPostcode, postcodeLookupWidget) {
    showAddressError(isNorthernIrelandPostcode, postcodeLookupWidget)
    show(addressSection(postcodeLookupWidget))
    enterManuallyHiddenInput(postcodeLookupWidget).value = 'true'
    hide(enterManuallyLink(postcodeLookupWidget))
  }

  function lookupPostcode (postcode, postcodeLookupWidget) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
    xhr.onload = function () {
      if (xhr.status !== 200) {
        handlePostcodeError(false, postcodeLookupWidget)
        return
      }

      var postcodeResponse = JSON.parse(xhr.responseText)

      if (!postcodeResponse.valid) {
        var ni = isNorthernIrelandPostcode(postcode)
        handlePostcodeError(ni, postcodeLookupWidget)
        return
      }

      var postcodeSelectDropdown = postcodeLookupWidget.querySelector('select')

      var nonSelectableOption = document.createElement("option")
      nonSelectableOption.text = postcodeResponse.addresses.length + ' addresses found'
      nonSelectableOption.disabled = true
      nonSelectableOption.selected = true
      clearPostcodeDropdown(postcodeLookupWidget)
      postcodeSelectDropdown.appendChild(nonSelectableOption)

      postcodeResponse.addresses.forEach(function (address) {
        var formattedAddress = address.formattedAddress.replace(/\r?\n|\r/g, ', ')
        var lines = formattedAddress.split(',')

        var valueFormattedAddress = [
          lines[0].trim(),
          lines.length > 3 ? lines[1].trim() : '',
          lines.length > 4 ? lines[2].trim() : '',
          lines[lines.length-2].trim(),
          lines[lines.length-1].trim()
        ].join(', ')
        var option = document.createElement('option')
        option.value = valueFormattedAddress
        option.text = formattedAddress
        postcodeSelectDropdown.appendChild(option)
      })

      show(postcodeAddressPicker(postcodeLookupWidget))
      hideAddressError(postcodeLookupWidget)
    }
    xhr.send()
  }
})()
