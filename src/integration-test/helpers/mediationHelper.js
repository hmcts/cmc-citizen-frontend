'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class MediationHelper extends codecept_helper {
  async checkEnhancedMediationJourney () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    const para = await helper.grabTextFrom('p');
    console.log(heading);
    console.log(para);
    if (heading === 'Free telephone mediation ') {
      console.log('enhanced mediation journey is enabled');
      Promise.resolve(true)
    } else if (heading === 'Free telephone mediation') {
      console.log('enhanced mediation journey is disabled');
      Promise.reject(false)
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in Mediation Service');
      Promise.reject(false)
    }
  }
}

module.exports = MediationHelper
