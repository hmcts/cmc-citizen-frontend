// Infrastructural variables
variable "product" {
  type    = "string"
  default = "cmc"
}

variable "microservice" {
  type = "string"
  default = "citizen-frontend"
}

variable "location" {
  type    = "string"
  default = "UK South"
}

variable "env" {
  type = "string"
}

variable "ssenv" {
  type = "string"
  default = "prd"
}

variable "ilbIp"{}

// Module configuration
variable "node-uv-threadpool-size" {
  type = "string"
  default = "64"
}

variable "draft-store-api-url" {
  type = "string"
  default = "https://testdraftstorelb.moneyclaim.reform.hmcts.net:4302"
}

variable "payments-api-url" {
  type = "string"
  default = "https://test.payments.reform.hmcts.net:4421"
}

variable "fees-api-url" {
  type = "string"
  default = "https://test.fees-register.reform.hmcts.net:4431"
}

variable "idam-api-url" {
  type = "string"
  default = "http://betaDevBccidamAppLB.reform.hmcts.net:4551"
}

variable "authentication-web-url" {
  type = "string"
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "service-2-service-auth-url" {
  type = "string"
  default = "http://betaDevBccidamAppLB.reform.hmcts.net:4552"
}
