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

variable "test-draft-store-api-url" {
  default = "https://testdraftstorelb.moneyclaim.reform.hmcts.net:4302"
}

variable "prod-draft-store-api-url" {
  default = "https://preproddraftstorelb.moneyclaim.reform.hmcts.net:4301"
//  default = "https://testdraftstorelb.moneyclaim.reform.hmcts.net:4301"
}

variable "test-payments-api-url" {
  default = "https://test.payments.reform.hmcts.net:4421"
}

variable "prod-payments-api-url" {
  default = "https://preprod.payments.reform.hmcts.net:4401"
//  default = "https://payments.reform.hmcts.net:4401"
}

variable "test-fees-api-url" {
  default = "https://test.fees-register.reform.hmcts.net:4431"
}

variable "prod-fees-api-url" {
  default = "https://preprod.fees-register.reform.hmcts.net:4411"
//  default = "https://fees-register.reform.hmcts.net:4411"
}

variable "test-idam-api-url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "prod-idam-api-url" {
  default = "http://betaPreProdccidamAppLB.reform.hmcts.net:4501"
  //  default = "http://betaProdccidamAppLB.reform.hmcts.net:4501"
}

variable "test-s2s-url" {
  default = "http://betaDevBccidamS2SLB.reform.hmcts.net"
}

variable "prod-s2s-url" {
  default = "http://betaPreProdccidamAppLB.reform.hmcts.net:4502"
  //  default = "http://betaProdccidamAppLB.reform.hmcts.net:4502"
}

variable "test-authentication-web-url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "prod-authentication-web-url" {
  default = "https://idam.preprod.ccidam.reform.hmcts.net"
//  default = "https://www.idam.reform.hmcts.net"
}

variable "subscription" {}
