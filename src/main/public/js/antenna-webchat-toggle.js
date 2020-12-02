(function() {        
        const button = document.querySelector('.chat-button');
        button.addEventListener('click', () => {
            window.open("/web-chat", "Popup", "location,status,scrollbars,resizable,width=360, height=610");
        });

        const buttonChat = document.querySelector('.webChat');
        buttonChat.addEventListener('click', () => {
            window.open("/web-chat", "Popup", "location,status,scrollbars,resizable,width=360, height=610");
        });
        
        const webChat = document.querySelector('web-chat');
        webChat.addEventListener('metrics', function (metrics) {
            var today = new Date();
            const metricsDetail = metrics.detail;
            const ewt = metricsDetail.ewt;
            const waitTimeInMinutes = ewt/60;
            const ccState = metricsDetail.contactCenterState;
            const availableAgents = metricsDetail.availableAgents;
            if (ccState != "Open" || (today.getHours() < 9 || today.getHours() > 17)) {
                document.getElementById("metrics").textContent = 'Web chat is now closed. Come back Monday to Friday 8.30am to 5pm or contact us by phone or email.';
                button.classList.add('hidden');
                buttonChat.classList.add('hidden');
            } else if (availableAgents == 0)
            {
                document.getElementById("metrics").textContent = 'No agents are currently available, Come back later.';
                button.classList.add('hidden');
                buttonChat.classList.add('hidden');
            } else if (waitTimeInMinutes > 5 && waitTimeInMinutes < 60 )
            {
                document.getElementById("metrics").textContent = 'All our agents are busy helping other people. Please try again later or contact us by phone or email.';
                button.classList.add('hidden');
                buttonChat.classList.add('hidden');
            }
            else {
                document.getElementById("metrics").textContent = '';
                button.classList.remove('hidden');
                buttonChat.classList.remove('hidden');
            }

          });
      
    }).call(this);
