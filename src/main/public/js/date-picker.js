const datePickerUtils = {

  getIndexOfDate: function(element) { return  $(element).data("index")},

  getDisplayValueOfDate: function(element) { return new Date($(element).text())},

  buildDatesArray: function(index, value) {
    return {
      index: index,
      value: value
    };
  },

  formatDateForData: function(d) {
    let mDate = moment(d);
    return {
      year: mDate.year(),
      month: mDate.month() + 1,
      day: mDate.date()
    };
  },

  displayFirstOfMonth: function(date) {
    const mDate = moment(date);
    const day = mDate.format("D");
    const year = mDate.year();
    const month = mDate.format("MMM");
    let displayMonth = { content};
    if (day === "1") {
      const month = mDate.format("MMM");
      displayMonth.content = "<span  aria-label="+ day + '' + month + ''+ year +"\>"+ day +"</span><p class=\"first-of-month\">" + month + "</p>";
    } else {
       displayMonth.content = "<span   aria-label="+ day + '' + month + ''+ year +"\>"+ day + "</span>";
    }
    return displayMonth;
  }
};

const datePicker = {

  init: function() { return datePicker.getBankHolidays(function(bankHolidays) { return datePicker.buildDatePicker(bankHolidays)})},

  getBankHolidays: function(callback) {
    $.ajax({
      type: "GET",
      url: "https://www.gov.uk/bank-holidays.json",
      success: function(res) {
        const events = res["england-and-wales"].events;
        const dates = events.map(function(event) { return moment(event.date).format("MM-D-YYYY")});
        callback(dates);
      },
      error: function() { return callback([])}
    })},

  buildDatePicker: function(datesDisabled) {
    datePicker.selector().datepicker({
      multidate: true,
      daysOfWeekDisabled: "06",
      defaultViewDate: moment().add(1, "days").format("MM-D-YYYY"),
      startDate: "+1d",
      weekStart: 1,
      maxViewMode: 0,
      showOtherMonths: true,
      datesDisabled: datesDisabled,
      templates: {
        leftArrow: datePicker.toggleArrows("prev"),
        rightArrow: datePicker.toggleArrows("next")
      },
      beforeShowDay: function(date) { return datePickerUtils.displayFirstOfMonth(date)}
    }).on("changeDate", function(event) { return datePicker.changeDateHandler(event)});

    datePicker.setUpDOWHeading();
    // Update the date-picker with dates that have already been added.
    const d = datePicker.getData().map(function(date) { return date.value });
    datePicker.selector().datepicker("setDates", d);
    datePicker.setDiasbleattribute();

  },
  selector: function() { return $("#date-picker")},

  setUpDOWHeading: function() {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dow = $(".dow");
    $.each(dow, function(index, node) { return node.textContent = days[index]});
  },

  toggleArrows: function(nextOrPrevArrow) {  return "<img tabindex=0  alt=\"date picker" + nextOrPrevArrow + "\" src=\"/img/date-picker/" + nextOrPrevArrow + "_arrow.png\" />" },

  changeDateHandler: function(event) {
    const uuid = $("#externalId")[0].innerText;
    const csrf = $("input[name=\"_csrf\"]").val();
    let dates = event.dates.map(function(eventDate) { return datePickerUtils.formatDateForData(eventDate)});
    let hasUnavailableDates = $("input[name=hasUnavailableDates]:checked").val();
    if (hasUnavailableDates === "true") {
      $.post("/case/" + uuid + "/directions-questionnaire/hearing-dates/date-picker/replace", {
        _csrf: csrf,
        hasUnavailableDates: hasUnavailableDates,
        unavailableDates: dates
      }, function(result) {
        $("#date-selection-wrapper").empty().append(result);
        $("#date-selection-wrapper .add-another-delete-link").click(function (e) {
          e.preventDefault();
          let dateIndex = /\d+$/.exec(e.currentTarget.id)[0];
          const d = dates
            .map(function(localDate) { return moment({ year: localDate.year, month: localDate.month - 1, day: localDate.day })})
            .map(function(mDate) { return mDate.toDate()})
            .sort(function(date1, date2) { date1.getTime() - date2.getTime()})
            .filter(function(localDate, index) { return index !== Number(dateIndex)});
          datePicker.selector().datepicker("setDates", d);
        });
      });
    }
    datePicker.setDiasbleattribute();
  },

  setDiasbleattribute: function() {
    $(".datepicker-days .disabled").find("span").each(function(index){ 
      if( $(".datepicker-days .disabled").find("span").eq(index).attr("aria-label").indexOf("is unavailable") === -1) {
        var dateDisabled  =  $(".datepicker-days .disabled").find("span").eq(index).attr("aria-label");
        $(".datepicker-days .disabled").find("span").eq(index).attr("aria-label", dateDisabled + " is unavailable")
      }
    });
  },
  
  getData: function() {
    const list = $(".add-another-list .add-another-list-item > span").toArray();
    return list.map(function(item) { return datePickerUtils.buildDatesArray(
      datePickerUtils.getIndexOfDate(item),
      datePickerUtils.getDisplayValueOfDate(item)
    )});
  }
};

/* global $ */
$(document).ready(function () {
  if ($("#date-picker").length) {
    $(".add-another-add-link").hide();
    datePicker.init();
  }
});
