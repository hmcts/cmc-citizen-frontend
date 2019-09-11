function getUrl () {
  if (window.location.port) {
    return window.location.hostname + ":" + window.location.port
  } else {
    return window.location.hostname
  }
}

webchat_init({
  uuid: 'script_17284281475d5519274e25a3.69472655',
  tenant: 'aG1jdHNzdGFnaW5nMDE',
  channel: 'CMC',
  btnNoAgents: '/aG1jdHNzdGFnaW5nMDE/button_7732814745cac6f4603c4d1.53357933/img/logo',
  btnAgentsBusy: '/aG1jdHNzdGFnaW5nMDE/button_2042157415cc19c95669039.65793052/img/logo',
  btnServiceClosed: '/aG1jdHNzdGFnaW5nMDE/button_20199488815cc1a89e0861d5.73103009/img/logo',
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
