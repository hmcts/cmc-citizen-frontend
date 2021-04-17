export class MediationHelper extends codecept_helper {
  static async checkEnhancedMediationJourney () {
    const helper = this.helpers['WebDriver'];
    const heading = await helper.grabTextFrom('h1');
    console.log(heading);
    if (heading === 'Free telephone mediation ') {
      console.log('enhancedMediationJourney is enabled')
      return true
    } else if (heading === 'Free telephone mediation') {
      console.log('enhancedMediationJourney is disabled');
      return false
    } else if (heading === 'Sorry, there is a problem with the service') {
      // silently move on.
      console.log('Error in Mediation Service');
      return false;
    }
  }
}