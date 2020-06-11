"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
class WebChat {
    static filterSecrets(accepted, secrets) {
        let result = {};
        for (let secret in secrets) {
            if (secret.search(accepted) > -1) {
                result[secret] = secrets[secret];
            }
        }
        return result;
    }
}
exports.WebChat = WebChat;
WebChat.main = '/webchat';
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(WebChat.main, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const webChatSecrets = WebChat.filterSecrets(['cmc-webchat'], config.get('secrets.cmc'));
    res.send(JSON.stringify(webChatSecrets));
});
