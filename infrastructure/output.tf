output "vaultUri" {
  value = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

output "vaultName" {
  value = "${local.vaultName}"
}

output "idam_url" {
  value = "${var.idam_api_url}"
}

output "claim_store_url" {
  value = "${local.claimStoreUrl}"
}
