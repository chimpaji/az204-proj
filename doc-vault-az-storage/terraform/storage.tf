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
