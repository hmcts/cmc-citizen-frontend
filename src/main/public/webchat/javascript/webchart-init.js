var _paq = _paq || []
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */

var xhttp
xhttp=new XMLHttpRequest
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var json = JSON.parse(this.response);

    webchat_init({
      uuid: 'script_' + json.chatId,
      tenant: json.tenant,
      channel: 'CMC',
      btnNoAgents: '/aG1jdHNzdGFnaW5nMDE/button_'+json.buttonNoAgents+'/img/logo',
      btnAgentsBusy: '/aG1jdHNzdGFnaW5nMDE/button_'+json.buttonAgentsBusy+'/img/logo',
      btnServiceClosed: '/aG1jdHNzdGFnaW5nMDE/button_'+json.buttonServiceClosed+'/img/logo',
      chatDownAction: 'showMessage',
      chatLinkFocusable: false,
      textChatDown: 'The web chat service is temporarily unavailable, please try again later.',
      textChatClosed: 'Web chat is now closed.\nOpening hours are Monday to Friday, 9:30am to 5pm.',
      textChatWithAnAgent: 'Chat online with an agent',
      textNoAgentsAvailable: 'No agents are available, please try again later.',
      textAllAgentsBusy: 'All our web chat agents are busy helping other people. Please try again later or contact us using one of the ways above.',
      textChatAlreadyOpen: 'A web chat window is already open.',
      textAdditional: 'Monday to Friday, 9am to 5pm.',
      stylesheetURL: 'https://' + getUrl() + '/webchat/css/hmcts-webchat-gds-v3.css',
      busHandlerURL: 'https://' + getUrl() + '/webchat/javascript/hmcts-webchat-busHandler.js',
      gdsMajorVersion: 3
    })
  }
};
xhttp.open("GET", '/webchat', true)
xhttp.send()


function getUrl () {
  if (window.location.port) {
    return window.location.hostname + ":" + window.location.port
  } else {
    return window.location.hostname
  }
}
