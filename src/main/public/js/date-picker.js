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

  formatDateForData: d => moment(new Date(d)).format('YYYY-MM-D'),

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

  changeDateHandler: event => {
    let uuid = /\/case\/([^/]+)\//.exec(window.location.pathname)[1]
    const csrf = $("input[name='_csrf']").val()
    let dates = event.dates.map(eventDate => datePickerUtils.formatDateForData(eventDate))
    $.post('/case/' + uuid + '/directions-questionnaire/hearing-dates/date-picker/replace', {
      _csrf: csrf,
      hasUnavailableDates: $("input[name=hasUnavailableDates]:checked").val() === 'yes',
      unavailableDates: dates,
    }, (result) => {
      $('#date-selection-wrapper').empty().append(result)
      $('#date-selection-wrapper .add-another-delete-link').click(function (e) {
        e.preventDefault()
        let dateIndex = /\d+$/.exec(e.currentTarget.id)[0]
        const d = dates.filter((date, index) => index !== Number(dateIndex)).map(dateStr => new Date(dateStr))
        datePicker.selector().datepicker('setDates', d)
      })
    })
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
