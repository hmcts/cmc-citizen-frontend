const Helper = codecept_helper;

// WebdriverIO 9 speaks only the W3C protocol, so IE11 window handling is gone.
class SauceLabsBrowserHelper extends Helper {
}

module.exports = SauceLabsBrowserHelper;
