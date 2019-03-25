var datePickerUtils = {

  getIndexFromDate: function(dateList, date) {
    return _.find(dateList, { value: new Date(date) }).index;
  },

  getValueOfDate: element => new Date($(element).text()),

  buildDatesArray: (index, value) => {
    return {
      index: index,
      value: value
    };
  },

  formatDateForDisplay: function(d) {
    var date = moment(new Date(d));
    return date.format('dddd D MMMM YYYY');
  },

  formatDateForData: d => {
    let mDate = moment(d)
    return {
      year: mDate.year(),
      month: mDate.month() + 1,
      day: mDate.date()
    }
  },

  displayFirstOfMonth: date => {
    const mDate = moment(date)
    const day = mDate.format('D')
    let displayMonth = { content: '<span>' + day + '</span>' }
    if (day === '1') {
      const month = mDate.format('MMM')
      displayMonth.content = '<span>' + day + '</span><p class="first-of-month">' + month + '</p>'
    }
    return displayMonth;
  }

};

var datePicker = {

  init: function() {
    datePicker.buildDatePicker()
  },

  buildDatePicker: function() {
    datePicker.selector().datepicker({
      multidate: true,
      daysOfWeekDisabled: '06',
      defaultViewDate: moment().add(1, 'days').format('MM-D-YYYY'),
      startDate: '+1d',
      weekStart: 1,
      maxViewMode: 0,
//      datesDisabled: [moment().add(4, 'days').format('MM-D-YYYY'), moment().add(14, 'days').format('MM-D-YYYY') ],
      templates: {
        leftArrow: datePicker.toggleArrows('prev'),
        rightArrow: datePicker.toggleArrows('next')
      },
      beforeShowDay: function(date) {
        return datePickerUtils.displayFirstOfMonth(date);
      }
    }).on('changeDate', function(event) {
      datePicker.changeDateHandler(event)
    });

    datePicker.setUpDOWHeading();

    // Update the date-picker with dates that have already been added.
    var d = datePicker.getData().map(function(date) {
      return date.value
    });
    datePicker.selector().datepicker('setDates', d);
  },

  selector: function() {
    return $('#date-picker')
  },

  setUpDOWHeading: function() {
    var days = [
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
      'SUN'
    ];
    var dow = $('.dow');
    $.each(dow, function(index) {
      $(this).text(days[index]);
    });
  },

  toggleArrows: function(nextOrPrevArrow) {
    return '<img alt="' + nextOrPrevArrow + '" src="/img/date-picker/' + nextOrPrevArrow + '_arrow.png" />';
  },

  // event.dates are Date objects
  changeDateHandler: event => {
    let uuid = /\/case\/([^/]+)\//.exec(window.location.pathname)[1]
    const csrf = $("input[name='_csrf']").val()
    let dates = event.dates.map(eventDate => datePickerUtils.formatDateForData(eventDate))
    // dates : LocalDate[]
    $.post('/case/' + uuid + '/directions-questionnaire/hearing-dates/date-picker/replace', {
      _csrf: csrf,
      hasUnavailableDates: $("input[name=hasUnavailableDates]:checked").val() === 'true',
      unavailableDates: dates,
    }, (result) => {
      $('#date-selection-wrapper').empty().append(result)
      $('#date-selection-wrapper .add-another-delete-link').click(function (e) {
        e.preventDefault()
        let dateIndex = /\d+$/.exec(e.currentTarget.id)[0]
        const d = dates
        // moment months are 0-indexed
          .map(localDate => moment({ ...localDate, month: localDate.month - 1 }))
          .map(mDate => mDate.toDate())
          .sort((date1, date2) => date1.getTime() - date2.getTime())
          .filter((localDate, index) => index !== Number(dateIndex))
        datePicker.selector().datepicker('setDates', d)
      })
    })
  },

  postDate: function (dates) {
    var lastestDateAdded = _.last(dates);
    var mDate = moment(lastestDateAdded);
    var body = {
      'item.day': mDate.date().toString(),
      'item.month': (mDate.month() + 1).toString(),
      'item.year': mDate.year().toString()
    };
    var index = _.indexOf(dates, lastestDateAdded);

    return datePicker.displayDateList(dates);

  },

  removeDate: function (dates) {
    var data = datePicker.getData();
    var oldDates = data.map(function (date) {
      return date.value
    });
    var newDates = dates;
    var dateToRemove = _.differenceWith(oldDates, newDates, _.isEqual).toString();
    var index = datePickerUtils.getIndexFromDate(data, dateToRemove);

    return datePicker.displayDateList(newDates);
  },

  getData: function () {
    var list = $('.add-another-list .add-another-list-item > span').toArray();
    return list.map(function(item) {
      return datePickerUtils.buildDatesArray(
      datePickerUtils.getIndexOfDate(item),
      datePickerUtils.getDisplayValueOfDate(item)
    );
    });
  }
};

/* global $ */
$(document).ready(function () {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide();
    datePicker.init();
  }
});
