'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class PcqHelper extends codecept_helper {
  // this method assumes user is navigated to PCQ
  rejectAnsweringPCQ () {
    const helper = this.helpers['WebDriver'];
    helper.waitForText('Equality and diversity questions')
    return helper.click(`I don't want to answer these questions`);
  }
  // this silently bypasses PCQ without throwing any errors
  async bypassPCQ () {
    const helper = this.helpers['WebDriver'];
    const crossBrowserTest = helper.options.capabilities['sauce:options']
    if (crossBrowserTest) {
      // add delay for crossbrowser tests as pages can take longer to load
      await helper.wait(5)
    }
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Equality and diversity questions') {
      // reject answering PCQ
      return this.rejectAnsweringPCQ()
    } else if (heading === 'Make a money claim') {
      // silently move on.
      console.log('PCQ is disabled');
      Promise.reject(false)
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in PCQ Service, hence Continuing to CMC');
      return helper.click(`Continue`);
    }
  }
  async checkPCQHealth () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Equality and diversity questions') {
      //if it is up and running
      return true
    } else if (heading === 'Make a money claim') {
      // silently move on.
      console.log('PCQ is disabled after PCQ Health');
      return false
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in PCQ Service, hence Continuing to CMC');
      return helper.click(`Continue`);
    }
  }
}

module.exports = PcqHelper
