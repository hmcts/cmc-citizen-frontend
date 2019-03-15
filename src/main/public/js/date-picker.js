$('#date-picker').datepicker({multidate:true});
// // $('#date-picker').on('changeDate', function() {
// //   $('#selected-dates').val(
// //     $('#date-picker').datepicker('getFormattedDate')
// //   );
// // });
//
// $(document).ready(() => {
//   datePicker.buildDatePicker();
// })
//
// const datePicker = {
//
//   buildDatePicker: () => {
//     datePicker.selector().datepicker({
//       multidate: true,
//       daysOfWeekDisabled: '06',
//       weekStart: 1
//     }).on('changeDate', event => datePicker.changeDateHandler(event));
//     // Update the date-picker with dates that have already been added.
//     datePicker.selector().datepicker('setDates', datePicker.getData().map(date => date.value));
//     datePicker.selector().off('keydown');
//     // window.setTimeout(datePicker.addAriaAttributes(), 0);
//   },
//
//   changeDateHandler: event => {
//     console.log('CALL changeDateHandler')
//     datePicker.addAriaAttributes();
//
//     return datePicker.displayDateList(event.dates);
//   },
//
//   displayDateList: dates => {
//     const datesIndex = dates.map((date, index) => datePicker.buildDatesArray(index, date));
//     let elements = '';
//
//     $.each(datesIndex, (index, date) => {
//       elements += `
//         <dt class="visually-hidden">items-${date.index}</dt>
//         <dd id="add-another-list-items-${date.index}" class="add-another-list-item">
//           <span data-index="items-${date.index}">
//             ${date.value}
//           </span>
//         </dd>`;
//     });
//     if (elements === '') {
//       const noItems = `<dt class="visually-hidden">No items</dt>
//         <dd class="add-another-list-item  noItems">No dates added yet</dd>`;
//       $('.add-another-list').empty().append(noItems);
//     } else {
//       $('.add-another-list').empty().append(elements);
//     }
//   },
//
//   buildDatesArray: (index, value) => {
//     return { index, value };
//   },
//
//   selector: () => $('#date-picker'),
//
//   getData: () => {
//     const list = $('.add-another-list .add-another-list-item > span').toArray();
//     return list.map(item => datePicker.buildDatesArray(
//       datePicker.getIndexOfDate(item),
//       datePicker.getValueOfDate(item)
//     ));
//   },
//
//   getIndexOfDate: element => $(element).data('index').split('-').pop(),
//
//   getValueOfDate: element => new Date($(element).text()),
//
//   addAriaAttributes: () => {
//     console.log('addAriaAttributes()')
//     $('tfoot').remove();
//     /* eslint-disable no-invalid-this */
//     $('.dow').each(function tabIndexOnWeekDays(index) {
//       const content = $(this).text();
//       $(this).html(`<div aria-label="${[
//         'Monday', 'Tuesday',
//         'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
//       ][index]}">${content}</div>`);
//     });
//     $('.prev').attr('role', 'button').attr('aria-label', 'previous month');
//     $('.next').attr('role', 'button').attr('aria-label', 'next month');
//     $('.day:not(".disabled")').each(function addAriaRole() {
//       if (!$(this).children('div').length) {
//         const attrib = parseInt($(this).attr('data-date'), 10);
//         const content = $(this).html();
//         $(this).attr('role', 'button');
//         const date = new Date(attrib)
//         $(this).html(`
//         <div aria-label="${date.getDate()} ${date.getMonth()} ${date.getFullYear()}
//       ${$(this).hasClass('active') ? ' selected' : ' deselected'}">${content}</div>`);
//       }
//     });
//   },
// }
