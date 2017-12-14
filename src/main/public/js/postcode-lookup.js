document.addEventListener('DOMContentLoaded', function (event) {
  document.querySelectorAll('.js-visible')
    .forEach(function (hiddenElement) {
      hiddenElement.classList.remove('hidden')
    })

  document.querySelectorAll('.postcode-lookup')
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
          var addressDetails = this.value.split(', ')
          var addressSelector = postcodeLookupWidget.querySelector('.address')
          addressSelector.querySelector('.address-line1').value = addressDetails[0]
          addressSelector.querySelector('.address-line2').value = addressDetails[1]
          addressSelector.querySelector('.address-town-or-city').value = addressDetails[2]
          addressSelector.querySelector('.postcode').value = addressDetails[3]
          showAddressEntry(postcodeLookupWidget)
        })

      if (isAnyAddressFieldPopulated(postcodeLookupWidget)) {
        showAddressEntry(postcodeLookupWidget)
      }
    })
})

function isNorthernIrelandPostcode (postcode) {
  return postcode.startsWith('BT')
}

function showAddressEntry (postcodeLookupWidget) {
  postcodeLookupWidget.querySelector('.address').classList.remove('js-hidden')
}

function clearPostcodeDropdown (postcodeLookupWidget) {
  postcodeLookupWidget.querySelector('select').innerHTML = ''
}

function hidePostcodeDropdown (postcodeLookupWidget) {
  postcodeLookupWidget.querySelector('.postcode-address-picker').classList.add('hidden')
}

function showPostcodeDropdown (postcodeLookupWidget) {
  postcodeLookupWidget.querySelector('.postcode-address-picker').classList.remove('hidden')
}

function clearAddressFields (postcodeLookupWidget) {
  var addressSelector = postcodeLookupWidget.querySelector('.address')
  addressSelector.querySelector('.address-line1').value = ''
  addressSelector.querySelector('.address-line2').value = ''
  addressSelector.querySelector('.address-town-or-city').value = ''
  addressSelector.querySelector('.postcode').value = ''
}

function isAnyAddressFieldPopulated(postcodeLookupWidget) {
  var addressSelector = postcodeLookupWidget.querySelector('.address')

  return addressSelector.querySelector('.address-line1').value !== '' ||
    addressSelector.querySelector('.address-line2').value !== '' ||
    addressSelector.querySelector('.address-town-or-city').value !== '' ||
    addressSelector.querySelector('.postcode').value !== ''
}

function showAddressError(isNorthernIrelandPostcode, postcodeLookupWidget) {
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
