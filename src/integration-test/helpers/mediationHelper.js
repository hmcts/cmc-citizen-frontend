'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class mediationHelper extends codecept_helper {
  async checkEnhancedMediationJourney () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    const para = await helper.grabTextFrom('p');
    console.log(heading);
    console.log(para);
    if (para.includes('We have automatically registered you')) {
      console.log('enhanced mediation journey is enabled');
      return true
    } else if (heading === 'Free telephone mediation') {
      console.log('enhanced mediation journey is disabled');
      return false
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in Mediation Service');
      return false
    }
  }
}

module.exports = mediationHelper
