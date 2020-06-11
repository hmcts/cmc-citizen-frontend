"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
class Paths {
}
Paths.main = '/analytics';
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(Paths.main, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const site = config.get('analytics');
    res.send(JSON.stringify(site));
});
