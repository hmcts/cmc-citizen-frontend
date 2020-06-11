"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("testing-support/paths");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.indexPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.render(paths_1.Paths.indexPage.associatedView, { paths: paths_1.Paths });
}));
