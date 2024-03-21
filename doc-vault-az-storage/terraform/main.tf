
# resource that generate 6 random characters
resource "random_id" "myrandom" {
  byte_length = 6
}

resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = local.location
}


# create azure static web app
resource "azurerm_static_web_app" "web" {
  name                = "static-site-8d3ebbb5eba8"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "westeurope"
  sku_tier            = "Free"
  depends_on          = [azurerm_resource_group.rg, azurerm_storage_account.storage]

  app_settings = {
    "DOC_VAULT_STORAGE_CONNECTION_STRING"         = azurerm_storage_account.storage.primary_connection_string
    "DOC_VAULT_COSMOS_CONNECTION_STRING"          = tolist(azurerm_cosmosdb_account.cosmosdb.connection_strings)[0]
    "NEXT_PUBLIC_DOC_VAULT_FUNCTION_DOWNLOAD_URL" = "UPLOAD_DOC_VAULT_FUNCTION_DOWNLOAD_URL_HERE"
  }

}

# create service plan
resource "azurerm_service_plan" "sp" {
  name                = "example-app-service-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Windows"
  sku_name            = "Y1"
}

# create azure function app // this will trigger when a new file is uploaded to the storage account and will create a new document in the cosmos db
resource "azurerm_windows_function_app" "function_upload_meta_to_cosmos" {
  name                = local.function_name
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  service_plan_id            = azurerm_service_plan.sp.id

  site_config {
  }
  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" : "~18"
    "WEBSITE_RUN_FROM_PACKAGE"             = "",
    "FUNCTIONS_WORKER_RUNTIME"             = "node",
    "DOC_VAULT_STORAGE_CONNECTION_STRING"  = azurerm_storage_account.storage.primary_connection_string
    "DOC_VAULT_COSMOSDB_CONNECTION_STRING" = tolist(azurerm_cosmosdb_account.cosmosdb.connection_strings)[0]
    "DOC_VAULT_CDN_ENDPOINT"               = azurerm_cdn_endpoint.endpoint.fqdn

  }

  lifecycle {
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
    ]
  }

  depends_on = [azurerm_storage_account.storage, azurerm_cosmosdb_account.cosmosdb, azurerm_service_plan.sp, azurerm_cdn_endpoint.endpoint]
}


