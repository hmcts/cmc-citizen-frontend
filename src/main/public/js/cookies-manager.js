$(document).ready(function(){
  checkCookie()
});

(function () {
    if (document.getElementById('save-cookie-preferences')) {
      document.getElementById("save-cookie-preferences").onclick = function () { setCookiePreference() };
    }
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
    var getAnalyticsSelectedValue = document.querySelector('input[name="analytics"]:checked');
    var getApmSelectedValue = document.querySelector('input[name="apm"]:checked');
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"analytics":' + getAnalyticsSelectedValue.value
                                + ',"apm:"' + getApmSelectedValue.value
                                + '}', 365)
    document.getElementById("cookie-preference-success").classList.remove("govuk-visually-hidden");
    if (document.getElementById('accept-all-cookies-successs')) {
      document.getElementById('accept-all-cookies-success').classList.add('govuk-visually-hidden');
    }
    if (document.getElementById('reject-all-cookies-success')) {
      document.getElementById('reject-all-cookies-success').classList.add('govuk-visually-hidden');
    }
    if (document.getElementById('cm_cookie_notification')) {
      document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
    }

    manageAnalyticsCookies(getAnalyticsSelectedValue.value)
    manageAPMCookie(getApmSelectedValue.value)
}

function setAcceptAllCookies() {
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"analytics":true,"apm":true}', 365)
    document.getElementById("accept-all-cookies-success").classList.remove("govuk-visually-hidden");
    document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
    manageAPMCookie('true')
}

function setRejectAllCookies() {
    setCookie('cookies_preferences_set', true, 365)
    setCookie('cookies_policy', '{"essential":true,"analytics":false,"apm":false}', 365)
    document.getElementById("reject-all-cookies-success").classList.remove("govuk-visually-hidden");
    document.getElementById("cm_cookie_notification").classList.add("govuk-visually-hidden");
    manageAnalyticsCookies('false')
    manageAPMCookie('false')
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; Secure=true";
}

function setAPMCookies(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/; Secure=true";
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
        cookies_policy = '{"essential":true,"analytics":false,"apm":false}';
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
    // setting the radio button value based on cookie value
    if (cookies_policy.split(',')[1].split(':')[1] == 'true')
    {
        $("#radio-analytics-off").attr('checked', false);
        $("#radio-analytics-on").attr('checked', true);
    } else {
        $("#radio-analytics-on").attr('checked', false);
        $("#radio-analytics-off").attr('checked', true);
        manageAnalyticsCookies('false')
    }

    if (cookies_policy.split(',')[2].split(':')[1].includes('true'))
    {
        $("#radio-apm-off").attr('checked', false);
        $("#radio-apm-on").attr('checked', true);
        manageAPMCookie('true')
    } else {
        $("#radio-apm-on").attr('checked', false);
        $("#radio-apm-off").attr('checked', true);
        manageAPMCookie('false')
    }
}

function manageAnalyticsCookies(cookieStatus) {
  if(cookieStatus === 'false') {
    deleteCookie('_ga')
    deleteCookie('_gid')
    deleteCookie('_gat')
  }
}

function manageAPMCookie(cookieStatus) {
    if(cookieStatus === 'false') {
      deleteCookie('dtCookie')
      deleteCookie('dtLatC')
      deleteCookie('dtPC')
      deleteCookie('dtSa')
      deleteCookie('rxVisitor')
      deleteCookie('rxvt')
    }
    apmPreferencesUpdated(cookieStatus)
}

function deleteCookie(cookie_name) {
    deleteCookieWithoutDomain(cookie_name);
    deleteCookieFromCurrentAndUpperDomain(cookie_name);
    removeFromLocalAndSessionStorage(cookie_name)
}

function deleteCookieWithoutDomain(cookie_name) {
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
}

function deleteCookieFromCurrentAndUpperDomain(cookie_name) {
    let hostname = window.location.hostname;
    let dotHostname = "." + hostname;
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ hostname +';path=/;';
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ dotHostname +';path=/;';

    //for live
    let firstDot = hostname.indexOf('.');
    let upperDomain = hostname.substring(firstDot);
    let dotUpperDomain = "." + upperDomain;
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ upperDomain +';path=/;';
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ dotUpperDomain +';path=/;';

    //for sub-live
    let dots = hostname.split('.');
    let subLiveUpperDomain = dots[dots.length - 2] + '.' + dots[dots.length - 1];
    let subLiveDotUpperDomain = "." + subLiveUpperDomain;
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ subLiveUpperDomain +';path=/;';
    document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain='+ subLiveDotUpperDomain +';path=/;';
}

function apmPreferencesUpdated(cookieStatus) {
  const dtrum = window.dtrum;

  if(dtrum !== undefined) {
    if(cookieStatus === 'true') {
      dtrum.enable();
      dtrum.enableSessionReplay();
    } else {
      dtrum.disableSessionReplay();
      dtrum.disable();
    }
  }
}

function removeFromLocalAndSessionStorage(cookie_name) {
    window.localStorage.removeItem(cookie_name);
    window.sessionStorage.removeItem(cookie_name);
}
