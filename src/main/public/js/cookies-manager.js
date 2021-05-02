(function () {
    checkCookie()
    document.getElementById("save-cookie-preferences").onclick = function () { setCookiePreference() };
    document.getElementById("cookie-accept-submit").onclick = function () { setAcceptAllCookies() };
    document.getElementById("cookie-reject-submit").onclick = function () { setRejectAllCookies() };
    document.getElementById('cookie-accept-all-success-banner-hide').onclick = function(){
        document.getElementById('accept-all-cookies-success').classList.add('govuk-visually-hidden');
    };
    document.getElementById('cookie-reject-all-success-banner-hide').onclick = function(){
        document.getElementById('reject-all-cookies-success').classList.add('govuk-visually-hidden');
    };
}).call(this);

function setCookiePreference() {
    var getSelectedValue = document.querySelector('input[name="analytics"]:checked');
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"usage":' + getSelectedValue.value, 365)
}

function setAcceptAllCookies() {
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"usage":true}', 365)
    document.getElementById("accept-all-cookies-success").classList.remove("govuk-visually-hidden");
    document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
}

function setRejectAllCookies() {
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"usage":false}', 365)
    document.getElementById("accept-all-cookies-success").classList.remove("govuk-visually-hidden");
    document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; Secure=true";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function checkCookie() {
    var cookies_policy = getCookie("cookies_policy");
    var cookies_preferences_set = getCookie("cookies_preferences_set");

    if (cookies_policy == "") {
        cookies_policy = '{"essential":true,"usage":false}';
        if (cookies_policy != "" && cookies_policy != null) {
            setCookie("cookies_policy", cookies_policy, 365);
        }
    }
    if (cookies_preferences_set == "") {
        setCookie('cookies_preferences_set', false, 365);
        document.getElementById("cm_cookie_notification").classList.remove("govuk-visually-hidden");
    }
    if (cookies_preferences_set == 'false') {
        document.getElementById("cm_cookie_notification").classList.remove("govuk-visually-hidden");
    }
}