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

variable "draft-store-api-url" {
  default = "https://testdraftstorelb.moneyclaim.reform.hmcts.net:4302"
}

variable "payments-api-url" {
  default = "https://test.payments.reform.hmcts.net:4421"
}

variable "fees-api-url" {
  default = "https://test.fees-register.reform.hmcts.net:4431"
}

variable "idam-api-url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "authentication-web-url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "service-2-service-auth-url" {
  default = "http://betaDevBccidamS2SLB.reform.hmcts.net"
}
