"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("claims/models/response/responseType");
const fullDefenceResponse_1 = require("claims/models/response/fullDefenceResponse");
const fullAdmissionResponse_1 = require("claims/models/response/fullAdmissionResponse");
const partialAdmissionResponse_1 = require("claims/models/response/partialAdmissionResponse");
const deserializers = {
    [responseType_1.ResponseType.FULL_DEFENCE]: fullDefenceResponse_1.FullDefenceResponse.deserialize,
    [responseType_1.ResponseType.FULL_ADMISSION]: fullAdmissionResponse_1.FullAdmissionResponse.deserialize,
    [responseType_1.ResponseType.PART_ADMISSION]: partialAdmissionResponse_1.PartialAdmissionResponse.deserialize
};
var Response;
(function (Response) {
    function deserialize(input) {
        return deserializers[input.responseType](input);
    }
    Response.deserialize = deserialize;
})(Response = exports.Response || (exports.Response = {}));
