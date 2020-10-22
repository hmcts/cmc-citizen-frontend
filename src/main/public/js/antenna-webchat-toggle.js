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
            const metricsDetail = metrics.detail;
            //const ewt = metricsDetail.ewt;
            const ccState = metricsDetail.contactCenterState;
            //const availableAgents = metricsDetail.availableAgents;
            if (ccState == "Open") {
                document.getElementById("metrics").textContent = 'Web chat is now closed. Come back Monday to Thursday 8.30am to 5pm and Friday 8.30am to 4pm, or contact us by phone or email.';
                button.classList.add('hidden');
                buttonChat.classList.add('hidden');
            } else {
                document.getElementById("metrics").textContent = '';
                button.classList.remove('hidden');
                buttonChat.classList.remove('hidden');
            }

          });
      
    }).call(this);