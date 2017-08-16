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

    ga('create', json.gaTrackingId, 'auto');
    ga('send', 'pageview');

    var idSite = json.piwikTrackingId;
    var piwikTrackingApiUrl = json.piwikTrackingSite;

    (function() {
      var u=piwikTrackingApiUrl;
      _paq.push(['setTrackerUrl', u+'piwik.php']);
      _paq.push(['setSiteId', idSite]);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
  }
};
xhttp.open("GET", '/analytics', true)
xhttp.send()
