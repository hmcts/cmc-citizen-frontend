"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('ClaimStatusFlow');
class ClaimStatusFlow {
    static decide(flow, claim) {
        if (flow.isValidFor(claim)) {
            const nextPossibleConditions = (flow.next || []).filter(state => state.isValidFor(claim));
            if (nextPossibleConditions.length > 1) {
                throw new Error(`Two possible paths are valid for a claim, check the flow's logic`);
            }
            if (nextPossibleConditions.length === 0) {
                if (!flow.dashboard) {
                    throw new Error(`Trying to render an intermediate state with no dashboard, check the flow's logic`);
                }
                return flow.dashboard;
            }
            return this.decide(nextPossibleConditions[0], claim);
        }
    }
    // the try/catch should be removed once we don't need backward compatibility with 'old' dashboards - it's here to make sure we render the
    // old status in case there are problems with the new one (which should be addressed)
    static dashboardFor(claim) {
        try {
            return this.decide(ClaimStatusFlow.flow, claim);
        }
        catch (err) {
            logger.error(err);
            return '';
        }
    }
}
exports.ClaimStatusFlow = ClaimStatusFlow;
ClaimStatusFlow.flow = {
    description: 'Claim Exists',
    isValidFor: () => true,
    next: [
        {
            description: 'Claim Issued',
            isValidFor: (claim) => !claim.response,
            dashboard: 'claim_issued',
            next: []
        }
    ]
};
