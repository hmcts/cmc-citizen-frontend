"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("first-contact/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.ErrorPaths.ccjRequestedHandoffPage.uri, (req, res) => {
    res.render(paths_1.ErrorPaths.ccjRequestedHandoffPage.associatedView);
});
