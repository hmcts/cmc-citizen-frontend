'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class HelpWithFeesHelper extends codecept_helper {
  // this method assumes user is in HWF reference screen
  rejectHWF () {
    const helper = this.helpers['WebDriver'];
    helper.waitForText('Do you have a Help With Fees reference number?')
    helper.click('No');
    return helper.click(`Save and continue`);
  }

  // this method assumes user is in HWF reference screen
  AnsweringHWF () {
    const helper = this.helpers['WebDriver'];
    helper.waitForText('Do you have a Help With Fees reference number?')
    return helper.click(`I don't want to answer these questions`);
  }

  // this silently bypasses HWF without throwing any errors
  async handelHelpWithFees () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Do you have a Help With Fees reference number?') {
      return this.rejectHWF()
    } else if (heading === 'Total amount you’re claiming') {
      // silently move on.
      console.log('Help with Fees is disabled');
      Promise.reject(false)
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in Help with Fees, hence Continuing to CMC');
      return helper.click(`Continue`);
    }
  }

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
