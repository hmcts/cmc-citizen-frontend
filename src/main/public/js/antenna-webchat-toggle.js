(function() {        
        const button = document.querySelector('.chat-button');
        button.addEventListener('click', () => {
            window.open("/web-chat", "Popup", "location,status,scrollbars,resizable,width=360, height=610");
        });

        const buttonChat = document.querySelector('.webChat');
        buttonChat.addEventListener('click', () => {
            window.open("/web-chat", "Popup", "location,status,scrollbars,resizable,width=360, height=610");
        });      
    }).call(this);