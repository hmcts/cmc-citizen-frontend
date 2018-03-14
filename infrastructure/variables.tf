// Infrastructural variables
variable "product" {
  default = "cmc"
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

variable "draft_store_api_url" {
  default = "https://testdraftstorelb.moneyclaim.reform.hmcts.net:4302"
}

variable "payments_api_url" {
  default = "https://test.payments.reform.hmcts.net:4421"
}

variable "fees_api_url" {
  default = "https://test.fees-register.reform.hmcts.net:4431"
}

variable "idam_api_url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "s2s_url" {
  default = "http://betaDevBccidamS2SLB.reform.hmcts.net"
}

variable "authentication_web_url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "subscription" {}

variable "vault_section" {
  default = "test"
}
// feature toggles
variable "feature_ccj" {
  default = "true"
}

variable "feature_offer" {
  default = "false"
}

variable "feature_statement_of_means" {
  default = "false"
}

variable "feature_full_admission" {
  default = "false"
}

variable "feature_partial_admission" {
  default = "false"
}

variable "feature_fine_print" {
  default = "false"
}

variable "feature_ccd" {
  default = "false"
}

variable "feature_return_error_to_user" {
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
