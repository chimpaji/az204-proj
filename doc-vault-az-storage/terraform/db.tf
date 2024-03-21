
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
