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
  path = "secret/test/ccidam/service-auth-provider/api/microservice-keys/cmc"
}

data "vault_generic_secret" "draft_store_secret" {
  path = "secret/test/cmc/draft-store/encryption-secrets/citizen-frontend"
}

data "vault_generic_secret" "postcode-lookup-api-key" {
  path = "secret/test/cmc/postcode-lookup/api-key"
}

data "vault_generic_secret" "oauth-client-secret" {
  path = "secret/test/ccidam/idam-api/oauth2/client-secrets/cmc-citizen"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
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
    NODE_ENV = "${var.env}"
    UV_THREADPOOL_SIZE = "64"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Application vars
    GA_TRACKING_ID = "UA-97111056-1"
    POSTCODE_LOOKUP_API_KEY = "${data.vault_generic_secret.s2s_secret.data["value"]}"

    // IDAM
    IDAM_API_URL = "${var.idam-api-url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication-web-url}"
    IDAM_S2S_AUTH = "${var.service-2-service-auth-url}"
    IDAM_S2S_TOTP_SECRET = "${data.vault_generic_secret.postcode-lookup-api-key.data["value"]}"
    OAUTH_CLIENT_SECRET = "${data.vault_generic_secret.oauth-client-secret.data["value"]}"

    // Payments API
    PAY_URL = "${var.payments-api-url}"

    // Fees API
    FEES_URL = "${var.fees-api-url}"

    // Draft Store API
    DRAFT_STORE_URL = "${var.draft-store-api-url}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.vault_generic_secret.draft_store_secret.data["primary"]}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.vault_generic_secret.draft_store_secret.data["secondary"]}"

    // Our service dependencies
    CLAIM_STORE_URL = "http://cmc-claim-store-${var.env}.service.${local.aseName}.internal"
    PDF_SERVICE_URL = "http://cmc-pdf-service-${var.env}.service.${local.aseName}.internal"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "true"
    FEATURE_CCJ = "true"
    FEATURE_OFFER = "true"
    FEATURE_STATEMENT_OF_MEANS = "true"
  }
}
