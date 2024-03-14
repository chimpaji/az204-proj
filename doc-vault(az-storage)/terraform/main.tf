
# an azure web service, connected to a github repository. 

locals {
  resource_group_name = "doc-vault-web-app"
  location            = "UK South"
  app_name            = "doc-vault"
}

# resource that generate 6 random characters
resource "random_id" "myrandom" {
  byte_length = 6
}

resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = local.location
}

resource "azurerm_service_plan" "sp" {
  name                = "sp"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Windows"
  sku_name            = "F1"

  depends_on = [azurerm_resource_group.rg]
}

# create azure web service for node.js(nextjs)
resource "azurerm_windows_web_app" "web" {
  name                = "web-${random_id.myrandom.hex}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.sp.location
  service_plan_id     = azurerm_service_plan.sp.id

  site_config {
    always_on = false
    cors {
      allowed_origins = ["*"]
    }
  }

  depends_on = [azurerm_service_plan.sp]
}

# connect to github

resource "azurerm_app_service_source_control" "example" {
  app_id   = azurerm_windows_web_app.web.id
  repo_url = "https://github.com/vercel/next.js/tree/canary/examples/hello-world"
  branch   = "canary"

  depends_on = [azurerm_windows_web_app.web]

}
