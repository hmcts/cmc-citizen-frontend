const datePickerUtils = {

  getIndexOfDate: element => $(element).data('index'),

  getValueOfDate: element => new Date($(element).text()),

  buildDatesArray: (index, value) => {
    return {
      index: index,
      value: value
    }
  },

  formatDateForDisplay: d => moment(new Date(d)).format('dddd D MMMM YYYY'),

  sortDates: dates => dates.sort((date1, date2) => date1.value - date2.value),

  displayFirstOfMonth: date => {
    const mDate = moment(date)
    const day = mDate.format('D')
    const month = mDate.format('MMM')
    let displayMonth = {
      content: '<span>' + day + '</span>'
    }
    if (day === '1') {
      displayMonth.content = '<span>' + day + '</span><p class="first-of-month">' + month + '</p>'
    }
    return displayMonth
  }
}

const datePicker = {

  init: () => datePicker.getBankHolidays(bankHolidays => datePicker.buildDatePicker(bankHolidays)),

  getBankHolidays: callback =>
    $.ajax({
      type: 'GET',
      url: 'https://www.gov.uk/bank-holidays.json',
      success: res => {
        const events = res['england-and-wales'].events
        const dates = events.map(event => moment(event.date).format('MM-D-YYYY'))
        callback(dates)
      },
      error: () => callback([])
    }),

  buildDatePicker: datesDisabled => {
    datePicker.selector().datepicker({
      multidate: true,
      daysOfWeekDisabled: '06',
      defaultViewDate: moment().add(1, 'days').format('MM-D-YYYY'),
      startDate: '+1d',
      endDate: '+10m',
      weekStart: 1,
      maxViewMode: 0,
      datesDisabled: datesDisabled,
      templates: {
        leftArrow: datePicker.toggleArrows('prev'),
        rightArrow: datePicker.toggleArrows('next')
      },
      beforeShowDay: date => datePickerUtils.displayFirstOfMonth(date)
    }).on('changeDate', event => datePicker.changeDateHandler(event))

    datePicker.setUpDOWHeading()

    // Update the date-picker with dates that have already been added.
    const d = datePicker.getData().map(date => date.value)
    datePicker.selector().datepicker('setDates', d)
  },

  selector: () => $('#date-picker'),

  setUpDOWHeading: () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const dow = $('.dow')
    $.each(dow, index => $(this).text(days[index]))
  },

  toggleArrows: nextOrPrevArrow => '<img alt="' + nextOrPrevArrow + '" src="/img/date-picker/' + nextOrPrevArrow + '_arrow.png" />',

  changeDateHandler: event => datePicker.displayDateList(event.dates),

  displayDateList: dates => {
    const datesIndex = dates.map((date, index) => datePickerUtils.buildDatesArray(index, date))
    const orderDates = datePickerUtils.sortDates(datesIndex)
    let elements = ''

    $.each(orderDates, (index, date) => {
      elements += '<div id="add-another-list-items-' + date.index + '">' +
        '<dd class="add-another-list-item">' +
        '<span data-index="items-' + date.index + '">' + datePickerUtils.formatDateForDisplay(date.value) + '</span>' +
        '<input type="hidden" name="unavailableDates[' + index + ']" value="' + new Date(date.value).getTime() + '" />' +
        '</dd>' +
        '<dd class="add-another-list-controls">' +
        '<a class="add-another-delete-link link" data-index="' + date.index + '">Remove</a>' +
        '</dd>' +
        '</div>'
    })
    if (elements === '') {
      const noItems = '<div>' +
        '<dd class="add-another-list-item">' +
        '<div id="items" class="noItems">No dates added yet</div>' +
        '</dd>' +
        '</div>'
      $('.add-another-list').empty().append(noItems)
    } else {
      $('.add-another-list').empty().append(elements)
      $('.add-another-delete-link').click(function () {
        const index = $(this).data('index')
        $('#add-another-list-items-' + index).remove()
        let d = datePicker.getData().map(date => date.value)
        datePicker.selector().datepicker('setDates', d)
      })
    }
  },

  getData: () => {
    const list = $('.add-another-list .add-another-list-item > span').toArray()
    return list.map(item => datePickerUtils.buildDatesArray(
        datePickerUtils.getIndexOfDate(item),
        datePickerUtils.getValueOfDate(item)
      ))
  }
}

/* global $ */
$(document).ready(function () {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide()
    datePicker.init()
  }
})
