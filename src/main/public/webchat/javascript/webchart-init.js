var _paq = _paq || []
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */

var xhttp
xhttp = new XMLHttpRequest
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var json = JSON.parse(this.response)

    webchat_init({
      uuid: 'script_' + json.cmc['webchat-chat-id'],
      tenant: json.cmc['webchat-tenant'],
      channel: 'CMC',
      btnNoAgents: '/' + json.cmc['webchat-tenant'] + '/button_' + json.cmc['webchat-button-no-agents'] + '/img/logo',
      btnAgentsBusy: '/' + json.cmc['webchat-tenant'] + '/button_' + json.cmc['webchat-button-agents-busy'] + '/img/logo',
      btnServiceClosed: '/' + json.cmc['webchat-tenant'] + '/button_' + json.cmc['webchat-button-service-closed'] + '/img/logo',
      chatDownAction: 'showMessage',
      chatLinkFocusable: false,
      textChatDown: 'The web chat service is temporarily unavailable, please try again later.',
      textChatClosed: 'Web chat is now closed. Come back Monday to Friday, 9am to 5pm.\nOr contact us using one of the ways below.',
      textChatWithAnAgent: 'Chat online with an agent',
      textNoAgentsAvailable: 'No agents are available, please try again later.',
      textAllAgentsBusy: 'All our web chat agents are busy helping other people. Please try again later or contact us using one of the ways below.',
      textChatAlreadyOpen: 'A web chat window is already open.',
      textAdditional: 'Monday to Friday, 9am to 5pm.',
      stylesheetURL: 'https://' + getUrl() + '/webchat/css/hmcts-webchat-gds-v3.css',
      busHandlerURL: 'https://' + getUrl() + '/webchat/javascript/hmcts-webchat-busHandler.js',
      gdsMajorVersion: 3
    })
  }
}
xhttp.open("GET", '/webchat', true)
xhttp.send()


function getUrl () {
  if (window.location.port) {
    return window.location.hostname + ":" + window.location.port
  } else {
    return window.location.hostname
  }
}
