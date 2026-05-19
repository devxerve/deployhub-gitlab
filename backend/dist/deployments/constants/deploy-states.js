"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployStatus = void 0;
var DeployStatus;
(function (DeployStatus) {
    DeployStatus["PENDING"] = "pending";
    DeployStatus["CLONING"] = "cloning";
    DeployStatus["BUILDING"] = "building";
    DeployStatus["RUNNING"] = "running";
    DeployStatus["FAILED"] = "failed";
    DeployStatus["SUCCESS"] = "success";
    DeployStatus["CANCELLED"] = "cancelled";
})(DeployStatus || (exports.DeployStatus = DeployStatus = {}));
//# sourceMappingURL=deploy-states.js.map