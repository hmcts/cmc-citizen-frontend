# Infrastructure

## Azure Vault ::: Secrets

1. Manually create in each env: `az keyvault secret set --vault-name cmc-<env> --name means-allowances --file <local_file_path>`
2. Update main.tf manifest with `data` resource

Notes: 
- environments at time of writing: `saat, sprod, sandbox, aat, demo, prod` (ignore errors if sandbox doesn't exist)
- same can be done via Azure console: https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.KeyVault%2Fvaults (filter by `cmc-`)