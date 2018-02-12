provider "vault" {
  //  # It is strongly recommended to configure this provider through the
  //  # environment variables described above, so that each user can have
  //  # separate credentials set in the environment.
  //  #
  //  # This will default to using $VAULT_ADDR
  //  # But can be set explicitly
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "s2s_secret" {
  path = "secret/${local.vault_section}/ccidam/service-auth-provider/api/microservice-keys/cmc"
}

data "vault_generic_secret" "draft_store_secret" {
  path = "secret/${local.vault_section}/cmc/draft-store/encryption-secrets/citizen-frontend"
}

data "vault_generic_secret" "postcode-lookup-api-key" {
  path = "secret/${local.vault_section}/cmc/postcode-lookup/api-key"
}

data "vault_generic_secret" "oauth-client-secret" {
  path = "secret/${local.vault_section}/ccidam/idam-api/oauth2/client-secrets/cmc-citizen"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  vault_section = "${var.env == "prod" ? "prod" : "test"}"

  idam_api_url = "${var.env == "prod" ? var.prod-idam-api-url : var.test-idam-api-url}"
  s2s_url = "${var.env == "prod" ? var.prod-s2s-url : var.test-s2s-url}"

  authentication_web_url = "${var.env == "prod" ? var.prod-authentication-web-url : var.test-authentication-web-url}"
  payments_api_url = "${var.env == "prod" ? var.prod-payments-api-url : var.test-payments-api-url}"
  fees_api_url = "${var.env == "prod" ? var.prod-fees-api-url : var.test-fees-api-url}"
  draft_store_api_url = "${var.env == "prod" ? var.prod-draft-store-api-url : var.test-draft-store-api-url}"
}

module "citizen-frontend" {
  source = "git@github.com:contino/moj-module-webapp.git"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION = "8.9.0"

    // Node specific vars
    NODE_ENV = "${var.env == "prod" ? "prod" : "dev"}"
    UV_THREADPOOL_SIZE = "64"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"
    TS_BASE_URL = "./src/main"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Application vars
    GA_TRACKING_ID = "UA-97111056-1"
    POSTCODE_LOOKUP_API_KEY = "${data.vault_generic_secret.postcode-lookup-api-key.data["value"]}"

    // IDAM
    IDAM_API_URL = "${local.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${local.authentication_web_url}"
    IDAM_S2S_AUTH = "${local.s2s_url}"
    IDAM_S2S_TOTP_SECRET = "${data.vault_generic_secret.s2s_secret.data["value"]}"
    OAUTH_CLIENT_SECRET = "${data.vault_generic_secret.oauth-client-secret.data["value"]}"

    // Payments API
    PAY_URL = "${local.payments_api_url}"

    // Fees API
    FEES_URL = "${local.fees_api_url}"

    // Draft Store API
    DRAFT_STORE_URL = "${local.draft_store_api_url}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.vault_generic_secret.draft_store_secret.data["primary"]}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.vault_generic_secret.draft_store_secret.data["secondary"]}"

    // Our service dependencies
    CLAIM_STORE_URL = "http://cmc-claim-store-${var.env}.service.${local.aseName}.internal"
    PDF_SERVICE_URL = "http://cmc-pdf-service-${var.env}.service.${local.aseName}.internal"

    // Surveys
    SERVICE_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPT1/"
    FEEDBACK_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPFB/"
    REPORT_PROBLEM_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPPB/"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "true"
    FEATURE_CCJ = "true"
    FEATURE_OFFER = "true"
    FEATURE_STATEMENT_OF_MEANS = "true"
  }
}
