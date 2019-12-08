// Infrastructural variables
variable "product" {}

variable "raw_product" {
  default = "cmc" // jenkins-library overrides product for PRs and adds e.g. pr-118-cmc
}

variable "microservice" {
  default = "citizen-frontend"
}

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "ga_tracking_id" {
  description = "Google Analytics tracking ID"
  default = "UA-97111056-1"
}

variable "http_timeout" {
  description = "Downstream request timeout in ms"
  default = "10000"
}

variable "payments_api_url" {
  default = "http://payment-api-aat.service.core-compute-aat.internal"
}

variable "fees_api_url" {
  default = "http://fees-register-api-aat.service.core-compute-aat.internal"
}

variable "idam_api_url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "authentication_web_url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "subscription" {}

// feature toggles
variable "feature_admissions" {
  default = "false"
}

variable "feature_paid_in_full" {
  default = "false"
}

variable "feature_mediation" {
  default = "false"
}

variable "feature_directions_questionnaire" {
  default = "false"
}

variable "feature_new_features_consent" {
  default = "false"
}

variable "feature_fine_print" {
  default = "false"
}

variable "feature_return_error_to_user" {
  default = "true"
}

variable "feature_mock_pay" {
  default = "false"
}

variable "feature_testing_support" {
  default = "false"
}

variable "feature_new_dashboard_status" {
  default = "false"
}

variable "feature_mediation_pilot" {
  default = "false"
}

variable "feature_web_chat" {
  default = "false"
}

variable "feature_inversionOfControl" {
  default = "false"
}

variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "client_id" {
  description = "(Required) The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. This is usually sourced from environment variables and not normally required to be specified."
}

variable "node_env" {
  // https://www.dynatrace.com/news/blog/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/
  default = "production"
}

variable "external_host_name" {
  default = "moneyclaims.sandbox.platform.hmcts.net"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default = ""
}

variable "capacity" {
  default = "1"
}

variable "common_tags" {
  type = "map"
}

// overriding the default module-webapp setting to debug intermittent 502 issue (outage: 23/11/18)
// will update when determined what we should set value to - or remove...
variable "website_local_cache_sizeinmb" {
  default = "300"
}

variable "log_level" {
  default = "INFO"
}

variable "node_debug" {
  default = ""
}

variable "node_version" {
  default = "10.15.2"
}
