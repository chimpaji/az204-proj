

# output deployment token of the static web app
output "set_this_in_github_secret_DOC_VAULT_DEPLOYMENT_TOKEN" {
  value = nonsensitive(azurerm_static_web_app.web.api_key)
}

# output connection string of the storage account
output "set_this_in_github_secret_DOC_VAULT_STORAGE_CONNECTION_STRING" {
  value = nonsensitive(azurerm_storage_account.storage.primary_connection_string)
}


output "set_this_in_github_secret_DOC_VAULT_COSMOSDB_CONNECTION_STRING" {
  value = nonsensitive(tolist(azurerm_cosmosdb_account.cosmosdb.connection_strings)[0])
}


output "cdn_profile_name" {
  value = azurerm_cdn_profile.profile.name
}

output "cdn_endpoint_endpoint_name" {
  value = azurerm_cdn_endpoint.endpoint.name
}

output "cdn_endpoint_fqdn" {
  value = azurerm_cdn_endpoint.endpoint.fqdn
}
