#!groovy
@Library(['CMC', 'Reform'])
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.cmc.integrationtests.IntegrationTests
import uk.gov.hmcts.cmc.smoketests.SmokeTests
//noinspection GroovyAssignabilityCheck this is how Jenkins does it
properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/cmc-citizen-frontend/'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']]),
   [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10']]
  ],
)

List<LinkedHashMap<String, Object>> secrets = [
  [$class: 'VaultSecret', path: 'secret/dev/cmc/snyk/api-token', secretValues:
    [
      [$class: 'VaultSecretValue', envVar: 'SNYK_TOKEN', vaultKey: 'value']
    ]
  ]
]

Ansible ansible = new Ansible(this, 'cmc')
Packager packager = new Packager(this, 'cmc')

SmokeTests smokeTests = new SmokeTests(this)
IntegrationTests integrationTests = new IntegrationTests(env, this)

String channel = '#cmc-tech-notification'

timestamps {
  milestone()
  lock(resource: "citizen-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('moj_centos_large2') {
      wrap([$class: 'VaultBuildWrapper', vaultSecrets: secrets]) {
        try {
          def version
          def citizenFrontendRPMVersion
          def citizenFrontendVersion
          def citizenIntegrationTestsVersion

          stage('Checkout') {
            deleteDir()
            checkout scm
          }

          onMaster {
            stage('Setup') {
              sh '''
              yarn install
              yarn setup
            '''
            }
          }

          stage('Package application (Docker)') {
            citizenFrontendVersion = dockerImage imageName: 'cmc/citizen-frontend'
            citizenIntegrationTestsVersion = dockerImage imageName: 'cmc/citizen-integration-tests',
              dockerArgs: '--file integration-tests.Dockerfile'
          }

          onPR {
            stage('Integration Tests') {
              integrationTests.executeCitizenTests([
                'CITIZEN_FRONTEND_VERSION'         : citizenFrontendVersion,
                'CITIZEN_INTEGRATION_TESTS_VERSION': citizenIntegrationTestsVersion,
                'TESTS_TAG'                        : '@citizen'
              ])
            }
          }

          onMaster {
            stage('Package application (RPM)') {
              citizenFrontendRPMVersion = packager.nodeRPM('citizen-frontend')
              version = "{citizen_frontend_buildnumber: ${citizenFrontendRPMVersion}}"

              packager.publishNodeRPM('citizen-frontend')
            }

            milestone()
            lock(resource: "CMC-deploy-demo", inversePrecedence: true) {
              stage('Deploy (Demo)') {
                ansible.runDeployPlaybook(version, 'demo')
              }
              stage('Smoke test (Demo)') {
                smokeTests.executeAgainst(env.CMC_DEMO_APPLICATION_URL)
              }
            }
            milestone()
          }
        } catch (Throwable err) {
          notifyBuildFailure channel: channel
          throw err
        } finally {
          step([$class           : 'InfluxDbPublisher',
                customProjectName: 'CMC Citizen Frontend',
                target           : 'Jenkins Data'])
        }
      }
    }
    milestone()
  }
  notifyBuildFixed channel: channel
}
