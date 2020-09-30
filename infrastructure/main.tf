provider "azurerm" {
 features {}
}

locals {
  vaultName = "${var.product}-${var.component}-${var.env}"
}

data "azurerm_key_vault" "cmc_key_vault" {
  name = local.vaultName
  resource_group_name = local.vaultName
}

data "azurerm_key_vault_secret" "cookie_encryption_key" {
  name = "citizen-cookie-encryption-key"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "s2s_secret" {
  name = "cmc-s2s-secret"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "draft_store_primary" {
  name = "citizen-draft-store-primary"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "draft_store_secondary" {
  name = "citizen-draft-store-secondary"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "os_postcode_lookup_api_key" {
  name = "os-postcode-lookup-api-key"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "oauth_client_secret" {
  name = "citizen-oauth-client-secret"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "staff_email" {
  name = "staff-email"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "launch_darkly_sdk_key" {
  name = "launchDarkly-sdk-key"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "cmc_webchat_id" {
  name = "cmc-webchat-id"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "cmc_webchat_tenant" {
  name = "cmc-webchat-tenant"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "cmc_webchat_button_no_agents" {
  name = "cmc-webchat-button-no-agents"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}
data "azurerm_key_vault_secret" "cmc_webchat_button_busy" {
  name = "cmc-webchat-button-busy"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "cmc_webchat_button_service_closed" {
  name = "cmc-webchat-button-service-closed"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}

data "azurerm_key_vault_secret" "pcq_token_key" {
  name = "pcq-token-key"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}
