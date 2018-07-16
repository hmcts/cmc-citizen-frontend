(function () {
  document.addEventListener('DOMContentLoaded', function (event) {

    var submitInputTypeList = document.querySelectorAll('input[type=submit]')
      .forEach(function (item) {
        item.addEventListener('dblclick', function (event) {
          event.preventDefault();
        })
      });
  });

})();
