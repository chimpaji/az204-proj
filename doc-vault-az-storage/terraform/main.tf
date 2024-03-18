
# an azure web service, connected to a github repository. 

locals {
  resource_group_name  = "doc-vault-web-app"
  location             = "UK South"
  app_name             = "doc-vault"
  storage_account_name = "docvaultstorage863443"
  service_plan_name    = "doc-vault-service-plan"
  cosmosdb_name        = "doc-vault-cosmosdb"
  cosmosdb_database    = "doc-vault-db"
  cosmosdb_container   = "doc-vault-container"
  function_name        = "doc-vault-function"
}

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
    "DOC_VAULT_STORAGE_CONNECTION_STRING" = azurerm_storage_account.storage.primary_connection_string
  }


}

# output deployment token of the static web app
output "set_this_in_github_secret_DOC_VAULT_DEPLOYMENT_TOKEN" {
  value = nonsensitive(azurerm_static_web_app.web.api_key)
}

# create blob storage account and container and get the connection string
resource "azurerm_storage_account" "storage" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = local.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    cors_rule {
      # allow localhost to access the storage account
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 86400
    }
  }

  depends_on = [azurerm_resource_group.rg]
}

resource "azurerm_storage_container" "container" {
  name                  = "docvaultcontainer"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"



  depends_on = [azurerm_storage_account.storage]
}


# output connection string of the storage account
output "set_this_in_github_secret_DOC_VAULT_STORAGE_CONNECTION_STRING" {
  value = nonsensitive(azurerm_storage_account.storage.primary_connection_string)
}

# create service plan
resource "azurerm_service_plan" "sp" {
  name                = "example-app-service-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Windows"
  sku_name            = "Y1"
}

# create cosmos db account(Core SQL API) and database and container and get the connection string as an output
resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                = local.cosmosdb_name
  location            = local.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = local.location
    failover_priority = 0
  }

  enable_automatic_failover       = false
  enable_multiple_write_locations = false

  depends_on = [azurerm_resource_group.rg]

}

resource "azurerm_cosmosdb_sql_database" "database" {
  name                = local.cosmosdb_database
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name

  depends_on = [azurerm_cosmosdb_account.cosmosdb]
}

resource "azurerm_cosmosdb_sql_container" "container" {
  name                = local.cosmosdb_container
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  database_name       = azurerm_cosmosdb_sql_database.database.name
  partition_key_path  = "/email"

  depends_on = [azurerm_cosmosdb_sql_database.database]
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
  }

  lifecycle {
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
    ]
  }

  depends_on = [azurerm_storage_account.storage, azurerm_cosmosdb_account.cosmosdb, azurerm_service_plan.sp]
}

output "set_this_in_github_secret_DOC_VAULT_COSMOSDB_CONNECTION_STRING" {
  value = nonsensitive(tolist(azurerm_cosmosdb_account.cosmosdb.connection_strings)[0])
}

#
