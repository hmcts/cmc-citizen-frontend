"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get('/not-implemented-yet', (req, res) => {
    res.render('not-implemented-yet');
});
