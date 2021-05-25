var _paq = _paq || []
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */

var xhttp
xhttp=new XMLHttpRequest
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var json = JSON.parse(this.response);

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    var cookiesPolicy = getCookie("cookies_policy");
    if (cookiesPolicy.split(',')[1].split(':')[1] === 'true') {
      window['ga-disable-'+json.gaTrackingId] = false
      ga('create', json.gaTrackingId, 'auto');
      ga('send', 'pageview');
    } else {
      window['ga-disable-'+json.gaTrackingId] = true
    }
  }
};
xhttp.open("GET", '/analytics', true)
xhttp.send()

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

