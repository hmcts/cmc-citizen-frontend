(function() {
        console.log('Antenna web chat enabled');
        
        const button = document.querySelector('.chat-button');
        const webChat = document.querySelector('web-chat');
        button.addEventListener('click', () => {
            console.log("Clicked Button...")
            webChat.classList.remove('hidden');
        });

        /**
         * When a user clicks the 'Hide' button on the chat client,
         * an event is dispatched on the web-chat component.
         * To listen for this event, we use the addEventListener DOM API
         * and register a callback.
         */
        webChat.addEventListener('hide', () => {
            console.log("Clicked Hide...")
            webChat.classList.add('hidden');
        });
      
    }).call(this);