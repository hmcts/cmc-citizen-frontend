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

// Our service dependencies
variable "claim-store-api-url" {
  type = "string"
  default = "https://unknown-claim-store-api-url.reform.hmcts.net"
}

variable "pdf-service-api-url" {
  type = "string"
  default = "https://unknown-pdf-service-api-url.reform.hmcts.net"
}

// Draft store
variable "draft-store-api-url" {
  type = "string"
  default = "https://unknown-draft-store-api-url.reform.hmcts.net"
}

// Payments
variable "payments-api-url" {
  type = "string"
  default = "https://unknown-payments-api-url.reform.hmcts.net"
}

// Fees
variable "fees-api-url" {
  type = "string"
  default = "https://unknown-fees-api-url.reform.hmcts.net"
}

// IDAM
variable "idam-api-url" {
  type = "string"
  default = "https://unknown-idam-api-url.reform.hmcts.net"
}

variable "authentication-web-url" {
  type = "string"
  default = "https://unknown-authentication-web-url.reform.hmcts.net"
}

variable "service-2-service-auth-url" {
  type = "string"
  default = "https://unknown-service-2-service-auth-url.reform.hmcts.net"
}
