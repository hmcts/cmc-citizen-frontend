#!groovy
@Library(['CMC', 'Reform'])
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger
import uk.gov.hmcts.cmc.integrationtests.IntegrationTests
import uk.gov.hmcts.cmc.smoketests.SmokeTests

//noinspection GroovyAssignabilityCheck this is how Jenkins does it
properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://github.com/cmc-citizen-frontend/'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

Ansible ansible = new Ansible(this, 'cmc')
Packager packager = new Packager(this, 'cmc')

SmokeTests smokeTests = new SmokeTests(this)
IntegrationTests integrationTests = new IntegrationTests(env, this)
def channel = '#cmc-tech-notification'

timestamps {
  milestone()
  lock(resource: "citizen-frontend-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('slave') {
      try {
        def version
        def citizenFrontendRPMVersion
        def citizenFrontendVersion
        def ansibleCommitId

        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        stage('Setup') {
          sh '''
            yarn install
            yarn setup
          '''
        }

        stage('Node security check') {
          try {
            sh "yarn test:nsp 2> nsp-report.txt"
          } catch (ignore) {
            sh "cat nsp-report.txt"
            archiveArtifacts 'nsp-report.txt'
            notifyBuildResult channel: channel, color: 'warning',
              message: 'Node security check failed see the report for the errors'
          }
          sh "rm nsp-report.txt"
        }

        // Travis runs all linting and unit testing, no need to do this twice (but run on master to be safe)
        onMaster {
          stage('Lint') {
            sh "yarn lint"
          }

          stage('Test') {
            try {
              sh "yarn test"
            } finally {
              archiveArtifacts 'mochawesome-report/unit.html'
            }
          }

          stage('Test routes') {
            try {
              sh "yarn test:routes"
            } finally {
              archiveArtifacts 'mochawesome-report/routes.html'
            }
          }

          stage('Test a11y') {
            try {
              sh "yarn test:a11y"
            } finally {
              archiveArtifacts 'mochawesome-report/a11y.html'
            }
          }

          stage('Test coverage') {
            try {
              sh "yarn test:coverage"
            } finally {
              archiveArtifacts 'coverage-report/lcov-report/index.html'
            }
          }
        }

        stage('Sonar') {
          onPR {
            sh """
              yarn sonar-scanner -- \
              -Dsonar.analysis.mode=preview \
              -Dsonar.host.url=$SONARQUBE_URL
            """
          }

          onMaster {
            sh "yarn sonar-scanner -- -Dsonar.host.url=$SONARQUBE_URL"
          }
        }

        stage('Package application (Docker)') {
          citizenFrontendVersion = dockerImage imageName: 'cmc/citizen-frontend'
        }

        stage('Package application (RPM)') {
          citizenFrontendRPMVersion = packager.nodeRPM('citizen-frontend')
          version = "{citizen_frontend_buildnumber: ${citizenFrontendRPMVersion}}"

          onMaster {
            packager.publishNodeRPM('citizen-frontend')
          }
        }

        stage('Integration Tests') {
          integrationTests.execute([
            'CITIZEN_FRONTEND_VERSION': citizenFrontendVersion,
            'TESTS_TAG'               : '@citizen'
          ])
        }

        //noinspection GroovyVariableNotAssigned It is guaranteed to be assigned
        RPMTagger rpmTagger = new RPMTagger(this,
          'citizen-frontend',
          packager.rpmName('citizen-frontend', citizenFrontendRPMVersion),
          'cmc-local'
        )

        onMaster {
          milestone()
          lock(resource: "CMC-deploy-dev", inversePrecedence: true) {
            stage('Deploy (Dev)') {
              ansibleCommitId = ansible.runDeployPlaybook(version, 'dev')
              rpmTagger.tagDeploymentSuccessfulOn('dev')
              rpmTagger.tagAnsibleCommit(ansibleCommitId)
            }
            stage('Smoke test (Dev)') {
              smokeTests.executeAgainst(env.CMC_DEV_APPLICATION_URL)
              rpmTagger.tagTestingPassedOn('dev')
            }
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
        currentBuild.result = 'SUCCESS'
      } catch (Throwable err) {
        notifyBuildFailure channel: channel
        currentBuild.result = 'FAILURE'
        throw err
      } finally {
        step([$class: 'InfluxDbPublisher',
            customData: null,
            customDataMap: null,
            customPrefix: null,
            target: 'Jenkins Data'])
      }
    }
    milestone()
  }
  notifyBuildFixed channel: channel
}
