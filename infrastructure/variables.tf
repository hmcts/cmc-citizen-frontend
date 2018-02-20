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
