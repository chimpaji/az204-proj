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
  cdn_profile_name     = "doc-vault-cdn-profile"
  cdn_endpoint         = "doc-vault-cdn-endpoint"
}
