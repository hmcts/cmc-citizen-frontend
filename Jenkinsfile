#!groovy

@Library('Reform@feature/slack-mapping') _

def channel = '#cmc-tech-notification'

timestamps {
  milestone()
  node('slave') {
    notifyBuildFailure channel: channel
  }
}
