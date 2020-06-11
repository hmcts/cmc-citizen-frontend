"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const clientFactory_1 = require("postcode-lookup/clientFactory");
const customEventTracker_1 = require("logging/customEventTracker");
const osPlacesClient = clientFactory_1.ClientFactory.createOSPlacesClient();
const logger = nodejs_logging_1.Logger.getLogger('postcode-lookup');
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.postcodeLookupProxy.uri, (req, res) => {
    if (!req.query.postcode || !req.query.postcode.trim()) {
        return res.status(400).json({
            error: {
                status: 400,
                message: 'Postcode not provided'
            }
        });
    }
    osPlacesClient.lookupByPostcode(req.query.postcode)
        .then((addressInfoResponse) => res.json(addressInfoResponse))
        .catch(err => {
        if (err.message === 'Authentication failed') {
            customEventTracker_1.trackCustomEvent(`Ordnance Survey keys stopped working`, { error: err });
        }
        logger.error(err.stack);
        res.status(500).json({
            error: {
                status: 500,
                message: err.message
            }
        });
    });
});
