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
    UV_THREADPOOL_SIZE = "${var.node-uv-threadpool-size}"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"
    TS_BASE_URL = "..\\..\\src\\main"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // IDAM
    IDAM_API_URL = "${var.idam-api-url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication-web-url}"
    IDAM_S2S_AUTH = "${var.service-2-service-auth-url}"

    // Payments API
    PAY_URL = "${var.payments-api-url}"

    // Fees API
    FEES_URL = "${var.fees-api-url}"

    // Draft Store API
    DRAFT_STORE_URL = "${var.draft-store-api-url}"

    // Our service dependencies
    CLAIM_STORE_URL = "http://cmc-claim-store-${var.env}.service.${local.aseName}.internal"
    PDF_SERVICE_URL = "http://cmc-pdf-service-${var.env}.service.${local.aseName}.internal"
  }
}
