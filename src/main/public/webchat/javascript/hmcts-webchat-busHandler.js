if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (let i=0; i<this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

(function(root) {
    const str = {
        youAreNowChattingWith1: 'You are now chatting with',
        youAreNowChattingWith2: ' {{agent}}. Please type in the box below to start your chat.',
        agentDisconnected: 'This chat has now ended. Click the ribbon on the top right if you wish to save a copy.',
        clickForOptions: 'Click for options',
        chatSessionEnded: 'Chat session has been ended.',
        confirmEndChat: 'Are you sure you want to end this chat conversation?',
        typeMessageHere: 'Type your message here',
        typeHere: 'Type here...',
        yourMessage: 'Your Message: ',
        agent: 'Agent: '
    };

    root.__8x8Chat = {
        onInit: function(bus) {
            bus.publish('chat:set-system-messages', {
                chatEstablishedName: str.youAreNowChattingWith1 + str.youAreNowChattingWith2,
                pullDownInfo: str.clickForOptions,
                endChatNotification: str.chatSessionEnded,
                endChatConfirmation: str.confirmEndChat,
                agentDisconnected: str.agentDisconnected
            });
        }
    };

    jQuery(document).ready(function() {
        const selectors = [
            '.container',
            '.message-wrapper',
            '.chat-incoming-msg, .chat-outgoing-msg'
        ];

        for (let i=0; i<selectors.length; i++) {
            jQuery(document).on('DOMNodeInserted', selectors[i], {selector: selectors[i]}, function (e) {
                onDOMNodeInserted(e.data.selector, e);
            });
        }
    });

    function onDOMNodeInserted(selector, e) {
        switch(selector) {
            case '.container':
                resizeChatWindow();
                adjustDomForAccessibility();
                validateEmail();
                highlightErrors();
                break;
            case '.message-wrapper':
                toggleActions('hide');
                toggleChatFieldOnChatStatus();
                addAriaLabelAndPlaceholderAttributesToChatField();
                break;
            case '.chat-incoming-msg, .chat-outgoing-msg':
                toggleActions('show');
                addAriaLabelAttributeToChatMessage(jQuery(e.target));
                break;
        }
    }

    function resizeChatWindow() {
        setInterval(function() {
            if (window.outerHeight < 560 || window.outerWidth < 350) {
                window.resizeTo(350, 560);
            }
        }, 1000);
    }

    function adjustDomForAccessibility() {
        removeUnusedContainers('.invitation-container, .offline-container, .skip-queue-container, .post-chat-container');
        removeLogos();
        addAriaLabelAttributeToLinks();
        addAriaLabelAttributeToTitles();
        addAriaLabelAttributeToButtons();
        addAriaLabelAndPlaceholderAttributesToPreChatFields();
        toggleSaveAccessibility();
    }

    function removeUnusedContainers(containers) {
        const containersArray = document.querySelectorAll(containers);
        for (let i = 0, len = containersArray.length; i < len; i++) {
            containersArray[i].remove();
        }
    }

    function removeLogos() {
        const headerLogoElements = document.querySelectorAll('.header .logo');
        if (headerLogoElements) {
            headerLogoElements.forEach(function(item) {
                item.remove();
            });
        }
    }

    function addAriaLabelAttributeToLinks() {
        const anchorElements = document.querySelectorAll('a');
        if (anchorElements) {
            anchorElements.forEach(function(item) {
                item.setAttribute('aria-label', item.getAttribute('title'));
            });
        }
    }

    function addAriaLabelAttributeToTitles() {
        const headerTitleElements = document.querySelectorAll('.header .title');
        if (headerTitleElements) {
            headerTitleElements.forEach(function(item) {
                item.setAttribute('aria-label', item.textContent);
                item.setAttribute('tabindex', 1);
            });
        }
    }

    function addAriaLabelAttributeToButtons() {
        const buttonElements = document.querySelectorAll('button');
        if (buttonElements) {
            buttonElements.forEach(function(item) {
                item.setAttribute('aria-label', item.textContent);
            });
        }
    }

    function addAriaLabelAndPlaceholderAttributesToPreChatFields() {
        const form = document.querySelector('.pre-chat-container .form-list');
        if (form) {
            const listElements = form.children;
            for (var i=0; i<listElements.length; i++) {
                const label = listElements[i].getElementsByTagName('label')[0];
                if (label) {
                    addAttributeToField(listElements[i], 'aria-label', label.textContent);
                    addAttributeToField(listElements[i], 'placeholder', str.typeHere);
                    wrapLabelInSpan(label);
                }
            }
        }
    }

    function addAttributeToField(wrapper, attribute, value) {
        let field = wrapper.getElementsByTagName('textarea')[0];

        if (!field) {
            field = wrapper.getElementsByTagName('input')[0];
        }

        field.setAttribute(attribute, value);
    }

    function wrapLabelInSpan(label) {
        const newSpan = document.createElement('span');
        const labelNodes = label.childNodes;

        labelNodes.forEach(function(item) {
            if (item.nodeType === Node.TEXT_NODE) {
                newSpan.appendChild(document.createTextNode(item.nodeValue));
                label.replaceChild(newSpan, item);
            }
        });
    }

    function validateEmail() {
        const emailField = document.querySelector('input[data-essential="email_id"]');

        if (emailField) {
            if (emailField.value !== '' && !isValidEmail(emailField.value)) {
                jQuery(emailField).siblings('label').children('.error-image').css('display', 'inline-block');
            } else {
                jQuery(emailField).siblings('label').children('.error-image').css('display', 'none');
            }
        }
    }

    function isValidEmail(email) {
        const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function highlightErrors() {
        const errorImages = document.querySelectorAll('.pre-chat-container .error-image');

        if (errorImages) {
            errorImages.forEach(function(item) {
                const field = jQuery(item).parent().siblings('textarea, input')[0];

                if (item.style.display === 'inline-block') {
                    jQuery(field).addClass('error');
                } else {
                    jQuery(field).removeClass('error');
                }
            });

            focusFirstError();
        }
    }

    function focusFirstError() {
        setTimeout(function() {
            jQuery('textarea.error, input.error').first().focus();
        }, 50);
    }

    function addAriaLabelAttributeToChatMessage(el) {
        jQuery('.chat-log-msg').attr('tabindex', '0');

        el.attr('tabindex', '0');

        let sender;
        if (el.hasClass('chat-incoming-msg')) {
            sender = str.agent;
        } else {
            sender = str.yourMessage;
        }
        let string = el.html();
        string = string.replace(/<span.*?<\/span>/g, '');

        el.attr('aria-label', sender + string);
    }

    function toggleChatFieldOnChatStatus() {
        const messageBoxElement = document.querySelector('.message-box');
        if (jQuery('.chat-log-msg').text().startsWith(str.youAreNowChattingWith1)) {
            jQuery(messageBoxElement).css('opacity', 1);
        }
        if (jQuery('.chat-error-msg').text().startsWith(str.agentDisconnected)) {
            jQuery(messageBoxElement).css('opacity', 0);
        }
    }

    function addAriaLabelAndPlaceholderAttributesToChatField() {
        const messageBoxItemElement = document.querySelector('.message-box-item');
        addAttributeToField(messageBoxItemElement, 'aria-label', str.typeMessageHere);
        addAttributeToField(messageBoxItemElement, 'placeholder', str.typeMessageHere);
    }

    function toggleActions(action) {
        const $actionElement = jQuery('.actions');
        const saveButton = document.querySelector('.action-save');

        switch(action) {
            case 'hide':
                jQuery('.action-clear').remove();
                if (!jQuery('.chat-log-msg').text().startsWith(str.youAreNowChattingWith1)) {
                    $actionElement.hide();
                }
                break;
            case 'show':
                $actionElement.show();
                saveButton.setAttribute('tabindex', '-1');
                break;
        }
    }

    function toggleSaveAccessibility() {
        const saveButton = document.querySelector('.action-save');

        jQuery('.flag').on('click', function() {
            setTimeout(function() {
                if (parseInt(jQuery('.message-actions').css('top')) === 0) {
                    saveButton.removeAttribute('tabindex');
                } else {
                    saveButton.setAttribute('tabindex', '-1');
                }
            }, 750);
        });
    }
})(this);
