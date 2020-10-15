$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  var web_Chat = document.querySelectorAll('web-chat');
  if (web_Chat[0].getElementsByClassName('agent-message message-bubble').length > 0 || web_Chat[0].getElementsByClassName('message-bubble waiting-for-agent').length > 0)
    {
      const webChat = document.querySelector('web-chat');
      webChat.classList.remove('hidden');
      document.getElementsByClassName("contact-us-for-help")[0].setAttribute('open',true);
    }
 

})
