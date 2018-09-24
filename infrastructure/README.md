# Infrastructure

## Azure Vault ::: Secrets

1. Manually create in each env: `az keyvault secret set --vault-name cmc-<env> --name means-allowances --file <local_file_path>`
2. Update main.tf manifest with `data` resource

Notes: 
- environments at time of writing: `saat, sprod, sandbox, aat, demo, prod`
- same can be done via Azure console: https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.KeyVault%2Fvaults (filter by `cmc-`)

## Example

```
az account set --subscription DCD-CNP-DEV
az keyvault secret set --vault-name cmc-aat --name means-allowances --file meansAllowances.json
az keyvault secret set --vault-name cmc-demo --name means-allowances --file meansAllowances.json
az account set --subscription DCD-CFT-Sandbox
az keyvault secret set --vault-name cmc-saat --name means-allowances --file meansAllowances.json
az keyvault secret set --vault-name cmc-sprod --name means-allowances --file meansAllowances.json
az keyvault secret set --vault-name cmc-sandbox --name means-allowances --file meansAllowances.json
```
