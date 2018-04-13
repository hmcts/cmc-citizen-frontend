#!groovy
@Library('Reform') _
//noinspection GroovyAssignabilityCheck this is how Jenkins does it
properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/cmc-citizen-frontend/'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']]),
  [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10']]
  ],
)

String channel = '#cmc-tech-notification'

timestamps {
  milestone()
  lock(resource: "citizen-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
    node {
      try {
        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        stage('Package application (Docker)') {
          dockerImage imageName: 'cmc/citizen-frontend'
          dockerImage imageName: 'cmc/citizen-integration-tests',
            dockerArgs: '--file integration-tests.Dockerfile'
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: channel
        throw err
      } finally {
        step([$class: 'InfluxDbPublisher',
               customProjectName: 'CMC Citizen Frontend',
               target: 'Jenkins Data'])
      }
    }
    milestone()
  }
  notifyBuildFixed channel: channel
}
