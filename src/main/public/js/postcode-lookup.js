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

            if (postcodeLookupWidget.querySelector('.form-control-error')) {
              enterManuallyLink(postcodeLookupWidget).classList.remove('hidden')
              hideManualErrorMessages(postcodeLookupWidget)
            }
            hide(postcodeAddressPicker(postcodeLookupWidget))
            clearAddressFields(postcodeLookupWidget)
            hide(addressSection(postcodeLookupWidget))
            lookupPostcode(this.previousElementSibling.value, postcodeLookupWidget)
          })

        postcodeLookupWidget.querySelector('.postcode-select')
          .addEventListener('change', function (event) {
            enterManuallyLink(postcodeLookupWidget).classList.add('hidden')
            var addressDetails = JSON.parse(this.value)
            var addressElement = postcodeLookupWidget.querySelector('.address')
            addressLine1(addressElement).value = addressDetails.addressLines[0]
            addressLine2(addressElement).value = addressDetails.addressLines[1]
            addressLine3(addressElement).value = addressDetails.addressLines[2]
            addressTownOrCity(addressElement).value = addressDetails.townOrCity
            addressPostcode(addressElement).value = addressDetails.postCode
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

  function hideManualErrorMessages (postcodeLookupWidget) {
    allFormControlErrors()
      .forEach(function (element) {
        element.classList.remove('form-control-error')
      })
    allFormGroupErrors()
      .forEach(function (element) {
        element.classList.remove('form-group-error')
      })
    allAddressErrorMessages(postcodeLookupWidget)
      .forEach(function (element) {
        element.classList.add('visually-hidden')
      })
  }

  function allFormControlErrors () {
    return document.querySelectorAll('.form-control-error')
  }

  function allFormGroupErrors () {
    return document.querySelectorAll('.form-group-error')
  }

  function allAddressErrorMessages (postcodeLookupWidget) {
    return addressSection(postcodeLookupWidget).querySelectorAll('.error-message')
  }

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
    postcode = postcode.trim().replace(/[\u202F\u00A0\u2000\u2001\u2003]/g, ' ')
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
      nonSelectableOption.disabled = true
      nonSelectableOption.selected = true
      clearPostcodeDropdown(postcodeLookupWidget)

      var listOfUprns = [];
      //declaring a list of UPRNS
      postcodeResponse.addresses.forEach(function (address) {
        //Going through each address
        if(!listOfUprns.includes(address.uprn)){
          //if list of uprns doesn't contain the address then add to list
          listOfUprns.push(address.uprn)
          var option = postcodeDropdownOption(address)
          if(option != undefined){
            postcodeSelectDropdown.appendChild(option)
        }
        }
      })
      //If already in list we don't do above as already in list

      nonSelectableOption.text = postcodeLookupWidget.querySelector('select').options.length + ' addresses found'
      postcodeSelectDropdown.appendChild(nonSelectableOption)

      show(postcodeAddressPicker(postcodeLookupWidget))
      hideAddressError(postcodeLookupWidget)
    }
    xhr.send()
  }

  function postcodeDropdownOption (address) {
    var formattedAddress = address.formattedAddress.replace(/\r?\n|\r/g, ', ')
    var valueFormattedAddress = {
      'addressLines': [],
      'townOrCity': address.postTown,
      'postCode': address.postcode
    }
    var buildingNameLine = extractBuildingNameLine(address)
    var streetLine = extractStreetLine(address)
    var localityLine = extractLocalityLine(address)

    if(address.organisationName && address.organisationName !== ""){
      valueFormattedAddress.addressLines.push(address.organisationName)
    }

    if (!buildingNameLine && (!streetLine || !address.buildingNumber) && address.organisationName && address.organisationName !== '') {
      valueFormattedAddress.addressLines.push(address.organisationName)
    }
    if (buildingNameLine) {
      valueFormattedAddress.addressLines.push(buildingNameLine)
    }
    if (streetLine) {
      valueFormattedAddress.addressLines.push(streetLine)
    }
    if (localityLine) {
      valueFormattedAddress.addressLines.push(localityLine)
    }
    while (valueFormattedAddress.addressLines.length < 3) {
      valueFormattedAddress.addressLines.push('')
    }
    var valueFormattedAddressStr = (valueFormattedAddress.addressLines + " " + valueFormattedAddress.townOrCity + ", " + valueFormattedAddress.postCode)
    //convert valueFormattedAddress addressLines, townOrCity and postcode into string
    if(valueFormattedAddressStr.replaceAll(",","").replaceAll(" ","")
      != formattedAddress.replaceAll(",","").replaceAll(" ","")){
      var formattedAddressArr = formattedAddress.split(",");
      var length = formattedAddressArr.length
      if(length >= 5){
        var formattedAddressJSON = {
          'addressLines': [],
          'townOrCity': formattedAddressArr[3],
          'postCode': formattedAddressArr[length-1]
        }

        //if valueFormattedAddress (with spaces and commas removed) is not the same
        // as not the same as formattedAddress (with spaces and commas removed)
        //then enter if statement
        //format formattedAddress into an array and separate with comma
        //find the length of formattedAddressArr
        //if the length of array is greater than/equal to 5
        //array into JSON
        //townorCity at array position 3 and postcode at length -1 as always last element in array

        formattedAddressJSON.addressLines.push(formattedAddressArr[0]);
        formattedAddressJSON.addressLines.push(formattedAddressArr[1]);
        formattedAddressJSON.addressLines.push(formattedAddressArr[2]);
        //changed to formattedAddress as this always displays correct info

        var option = document.createElement('option')
        option.value = JSON.stringify(formattedAddressJSON)
        option.text = formattedAddress
        return option

        //JSON.stringify formattedAddress rather than valueFormattedAddress
      }
      return undefined

    }
    var option = document.createElement('option')
    option.value = JSON.stringify(valueFormattedAddress)
    option.text = formattedAddress
    return option
    //however, if formattedAddress does equal valueFormattedAddress then the code goes into here

    function extractBuildingNameLine (address) {
      if (address.buildingName && address.buildingName !== "") {
        if (address.subBuildingName && address.subBuildingName !== "") {
          return address.subBuildingName + ', ' + address.buildingName
        }
        return address.buildingName +", "
      }
      if (address.subBuildingName && address.subBuildingName !== "") {
        return address.subBuildingName+", "
      }
      return undefined
    }

    function extractStreetLine (address) {
      if (address.thoroughfareName && address.thoroughfareName !== "") {
        if(address.dependentThoroughfareName && address.dependentThoroughfareName !== ""){
          return (address.organisationName ? ' ':'') +(address.buildingNumber ? address.buildingNumber + ', ' : ' ')
            + address.dependentThoroughfareName + ', ' + address.thoroughfareName
        }
        return (address.organisationName ? ' ':'')+(address.buildingNumber ? address.buildingNumber + ', ' : ' ') + address.thoroughfareName
      }
      if (address.dependentThoroughfareName && address.dependentThoroughfareName !== "") {
        return (address.organisationName ? ' ':'')+(address.buildingNumber ? address.buildingNumber + ', ' : ' ') + address.dependentThoroughfareName
      }
      return undefined
    }

    function extractLocalityLine(address) {
      if (address.dependentLocality && address.dependentLocality !== "") {
        return ' ' + address.dependentLocality
      }
      return undefined
    }
  }
})()
