"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
class DashboardPage {
    open() {
        I.click('My account');
    }
    selectClaim(claimRef) {
        I.click(claimRef);
    }
}
exports.DashboardPage = DashboardPage;
