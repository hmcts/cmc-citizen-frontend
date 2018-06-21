locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

  s2sUrl = "http://rpe-service-auth-provider-${local.local_env}.service.${local.local_ase}.internal"
  claimStoreUrl = "http://cmc-claim-store-${local.local_env}.service.${local.local_ase}.internal"
  draftStoreUrl = "http://draft-store-service-${local.local_env}.service.${local.local_ase}.internal"
}

data "azurerm_key_vault" "cmc_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "s2s_secret" {
  name = "cmc-s2s-secret"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "draft_store_primary" {
  name = "citizen-draft-store-primary"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "draft_store_secondary" {
  name = "citizen-draft-store-secondary"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "postcode_lookup_api_key" {
  name = "postcode-lookup-api-key"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "oauth_client_secret" {
  name = "citizen-oauth-client-secret"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "staff_email" {
  name = "staff-email"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

module "citizen-frontend" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=RPE-389/local-cache"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${var.env != "preview" ? 1: 0}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  subscription = "${var.subscription}"
  additional_host_name = "${var.env != "preview" ? var.external_host_name : "null"}"
  https_only = "true"
  capacity = "${var.capacity}"

  app_settings = {
    // Node specific vars
    NODE_ENV = "${var.node_env}"
    UV_THREADPOOL_SIZE = "64"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"
    TS_BASE_URL = "./src"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Application vars
    GA_TRACKING_ID = "${var.ga_tracking_id}"
    POSTCODE_LOOKUP_API_KEY = "${data.azurerm_key_vault_secret.postcode_lookup_api_key.value}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_S2S_AUTH = "${local.s2sUrl}"
    IDAM_S2S_TOTP_SECRET = "${data.azurerm_key_vault_secret.s2s_secret.value}"
    OAUTH_CLIENT_SECRET = "${data.azurerm_key_vault_secret.oauth_client_secret.value}"

    // Payments API
    PAY_URL = "${var.payments_api_url}"

    // Fees API
    FEES_URL = "${var.fees_api_url}"

    // Draft Store API
    DRAFT_STORE_URL = "${local.draftStoreUrl}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.azurerm_key_vault_secret.draft_store_primary.value}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.azurerm_key_vault_secret.draft_store_secondary.value}"

    // Our service dependencies
    CLAIM_STORE_URL = "${local.claimStoreUrl}"

    // Surveys
    SERVICE_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPT1/"
    FEEDBACK_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPFB/"
    REPORT_PROBLEM_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPPB/"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "${var.env == "prod" ? "false" : "true"}"
    // Enabled everywhere except prod
    FEATURE_CCJ = "${var.feature_ccj}"
    FEATURE_OFFER = "${var.feature_offer}"
    FEATURE_STATEMENT_OF_MEANS = "${var.feature_statement_of_means}"
    FEATURE_FULL_ADMISSION = "${var.feature_full_admission}"
    FEATURE_PARTIAL_ADMISSION = "${var.feature_partial_admission}"
    FEATURE_FINE_PRINT = "${var.feature_fine_print}"
    FEATURE_RETURN_ERROR_TO_USER = "${var.feature_return_error_to_user}"

    CONTACT_EMAIL = "${data.azurerm_key_vault_secret.staff_email.value}"

  }
}

