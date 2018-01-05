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

            clearPostcodeDropdown(postcodeLookupWidget)
            hidePostcodeDropdown(postcodeLookupWidget)
            clearAddressFields(postcodeLookupWidget)
            lookupPostcode(this.previousElementSibling.value, postcodeLookupWidget)
          })

        postcodeLookupWidget.querySelector('.postcode-select')
          .addEventListener('change', function (event) {
            enterManuallyLink(postcodeLookupWidget).classList.add('hidden')

            var addressDetails = this.value.split(', ')
            var addressElement = postcodeLookupWidget.querySelector('.address')
            addressLine1(addressElement).value = addressDetails[0]
            addressLine2(addressElement).value = addressDetails[1]
            addressTownOrCity(addressElement).value = addressDetails[2]
            addressPostcode(addressElement).value = addressDetails[3]
            showAddressEntry(postcodeLookupWidget)
          })

        enterManuallyLink(postcodeLookupWidget)
          .addEventListener('click', function (event) {
            event.preventDefault()

            showAddressEntry(postcodeLookupWidget)
            this.classList.add('hidden')
            enterManuallyHiddenInput(postcodeLookupWidget).value = 'true'
          })

        var anyAddressFieldPopulated = isAnyAddressFieldPopulated(postcodeLookupWidget)
        if (anyAddressFieldPopulated) {
          showAddressEntry(postcodeLookupWidget)
        }

        // Show postcode dropdown on postback in case of validation error
        if (postcodeAddressPickerHiddenInput(postcodeLookupWidget).value === 'true' && !anyAddressFieldPopulated) {
          showPostcodeDropdown(postcodeLookupWidget)
          lookupPostcode(postcodeSearchButton(postcodeLookupWidget).previousElementSibling.value, postcodeLookupWidget)
        }

        // Show fields if manual entry was previously clicked
        if (enterManuallyHiddenInput(postcodeLookupWidget).value === 'true') {
          showAddressEntry(postcodeLookupWidget)
        }
      })

    document.querySelector('#saveAndContinue')
      .addEventListener('click', function (event) {
        allPostcodeLookupWidgets()
          .forEach(function (postcodeLookupWidget) {
            postcodeLookupWidget.querySelector('.postcode-address-visible').value =
              !addressSection(postcodeLookupWidget)
                .classList.contains('js-hidden')

            postcodeLookupWidget.querySelector('.address-selector-visible').value =
              !postcodeAddressPicker(postcodeLookupWidget)
                .classList.contains('hidden')
          })
      })
  })

  function enterManuallyLink(postcodeLookupWidget) {
    return postcodeLookupWidget.querySelector('.postcode-enter-manually')
  }

  function postcodeSearchButton(postcodeLookupWidget) {
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

  function addressTownOrCity (addressElement) {
    return addressElement.querySelector('.address-town-or-city')
  }


  function addressPostcode (addressElement) {
    return addressElement.querySelector('.postcode')
  }

  function showAddressEntry (postcodeLookupWidget) {
    addressSection(postcodeLookupWidget).classList.remove('js-hidden')
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

  function lookupPostcode (postcode, postcodeLookupWidget) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
    xhr.onload = function () {
      if (xhr.status !== 200) {
        showAddressError(false, postcodeLookupWidget)
        showAddressEntry(postcodeLookupWidget)
        return
      }

      var postcodeResponse = JSON.parse(xhr.responseText)

      if (!postcodeResponse.valid) {
        var ni = isNorthernIrelandPostcode(postcode)
        showAddressError(ni, postcodeLookupWidget)
        showAddressEntry(postcodeLookupWidget)
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

    }
    xhr.send()
  }
})()
