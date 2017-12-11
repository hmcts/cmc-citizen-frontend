document.querySelectorAll('.postcode-lookup')
  .forEach(function (postcodeLookupButton) {
    postcodeLookupButton.addEventListener('click', function (evt) {
      evt.preventDefault()
      lookupPostcode(this.previousElementSibling.value, this.parentElement)
    })
  })

function lookupPostcode (postcode, parentElement) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/postcode-lookup?postcode=' + encodeURIComponent(postcode))
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('status:' + 200)
    }
    else {
      alert('Request failed.  Returned status of ' + xhr.status)
    }


    var postcodeResponse = JSON.parse(xhr.responseText)

    console.log(postcodeResponse.valid)

    var selectDropdown = '<option>' + postcodeResponse.addresses.length + ' addresses found </option>'

    postcodeResponse.addresses.forEach(function(address) {

      var formatted_address = [
      (address.organisationName || address.subBuildingName) + ' ' + (address.buildingNumber || address.buildingName || undefined),
      address.thoroughfareName || address.dependentLocality,
        address.postTown,
        address.postcode
    ]
      selectDropdown += '<option value="' + formatted_address.join(', ').trim() + '">' + formatted_address.join(', ').trim() + '</option>'
    })

    parentElement.parentElement.querySelector('select').innerHTML = selectDropdown


  }
  xhr.send()
}

function showSelectAddress () {

  $('#address-select-container').removeClass('error')
  $('#address-select-container .error-message').hide()
  $('#enter-manually').show()

  if ($('#postcode').val().toUpperCase().indexOf('BT') === 0) {

    $('#country').val('Northern Ireland')
    $('#postcode-seach-ni-error').show()
    $('#select-address').hide()
    showManualEntry()

  } else {

    $.ajax({
      url: "/postcode-lookup?postcode=" + encodeURIComponent($('#postcode').val()),
      method: "GET",
      success: function (data, status, xhr) {
        if (status === "success" && data.length) {

          jQuery.each(data, function (key, value) {
            var formatted_address = [
              (value.organisation_name || value.sub_building_name) + ' ' + (value.building_number || value.building_name || null),
              value.thoroughfare_name || value.dependent_locality,
              value.post_town,
              value.postcode
            ]
            html += '<option value="' + formatted_address.join(', ').trim() + '">' + formatted_address.join(', ').trim() + '</option>'
          })

          $('#addressList').html(html)

          $('.postcode-as-text p').html($('#postcode').val())
          $('#enter-postcode').hide()
          $('#select-address').show()
          $('#selected-address').hide()
          $('#manual-address').hide()
          $('#postcode-seach-error').hide()
          $('#postcode-seach-ni-error').hide()
          $('#continue-button').unbind('click').click(function (e) {
            e.preventDefault()
            $('#address-select-container').addClass('error')
            $('#address-select-container .error-message').show()
          })

        } else {

          $('#postcode-seach-error').show()
          $('#postcode-seach-ni-error').hide()
          showManualEntry()

        }

      },
      dataType: 'JSON'
    })

    $.ajax({
      url: "/country-lookup?postcode=" + encodeURIComponent($('#postcode').val()),
      method: "GET",
      success: function (data, status, xhr) {

        $('#country').val(data.country.name)
      },
      dataType: 'JSON'

    })
  }
}

function showSelectedAddress () {
  $('#address-select-container').removeClass('error')
  $('#address-select-container .error-message').hide()
  $('#enter-postcode').hide()
  $('#select-address').show()
  $('#selected-address').hide()
  $('#manual-address').show()
}

function updateAddress (address) {
  showSelectedAddress()
  var addresses = $('#addressList').val().split(', ')
  $("#street-1").val(addresses[0])
  $("#street-2").val(addresses[1])
  $("#town").val(addresses[2])
  $("#postcode-full, #postcode-full-auto").val(addresses[3])
  $('#continue-button').unbind('click')
  $('#find-button').addClass('secondary-button')
  $('#continue-button').removeClass('secondary-button')
  $('#continue-button').addClass('button')
  $('#enter-manually').show()
}

function showAbroadAddress () {
  $('#street-label').html('Address')
  $('#postcode-label').html('Postal/ZIP code')
  $('#manual-address').show()
  $('#country').attr('type', 'text')
  $('#manual-address').addClass('abroad')
  $('#enter-manually').hide()
  $('#postcode-finder').hide()
  $('#enter-automatic').show()
  $('#select-address').hide()

  $('#continue-button').unbind('click')
  $('#continue-button').removeClass('secondary-button')
  $('#continue-button').addClass('button')
  return false
}

function showPostcodeLookup () {
  $('#manual-address').hide()
  $('#enter-manually').show()
  $('#postcode-finder').show()
  $('#enter-automatic').hide()

  return false
}


function showManualEntry () {
  $('#manual-address').show()

  $("#postcode-full").val($('#postcode').val())

  $('#continue-button').unbind('click')
  $('#find-button').addClass('secondary-button')
  $('#continue-button').removeClass('secondary-button')
  $('#continue-button').addClass('button')
  return false

}
