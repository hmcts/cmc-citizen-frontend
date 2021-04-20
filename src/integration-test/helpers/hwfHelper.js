'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class hwfHelper extends codecept_helper {
  async checkHWF () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Do you have a Help With Fees reference number?') {
      return true
    } else if (heading === 'Total amount you’re claiming') {
      console.log('Help with Fees is disabled');
      return false
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in HWF Service');
      return false;
    }
  }
}

module.exports = hwfHelper
