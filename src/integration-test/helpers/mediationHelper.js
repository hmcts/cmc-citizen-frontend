'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class MediationHelper extends codecept_helper {
  static checkEnhancedMediationJourney () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Free telephone mediation ') {
      console.log('enhanced mediation journey is enabled');
      return true
    } else if (heading === 'Free telephone mediation') {
      console.log('enhanced mediation journey is disabled');
      return false
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in Mediation Service');
      return false;
    }
  }
}

module.exports = MediationHelper
