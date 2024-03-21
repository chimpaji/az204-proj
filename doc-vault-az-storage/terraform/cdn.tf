
resource "azurerm_cdn_profile" "profile" {
  name                = local.cdn_profile_name
  location            = "westeurope"
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard_Microsoft"

  depends_on = [azurerm_resource_group.rg]
}



resource "azurerm_cdn_endpoint" "endpoint" {
  name                          = local.cdn_endpoint
  profile_name                  = azurerm_cdn_profile.profile.name
  location                      = "westeurope"
  resource_group_name           = azurerm_resource_group.rg.name
  is_http_allowed               = true
  is_https_allowed              = true
  querystring_caching_behaviour = "IgnoreQueryString"
  is_compression_enabled        = true
  content_types_to_compress = [
    "application/eot",
    "application/font",
    "application/font-sfnt",
    "application/javascript",
    "application/json",
    "application/opentype",
    "application/otf",
    "application/pkcs7-mime",
    "application/truetype",
    "application/ttf",
    "application/vnd.ms-fontobject",
    "application/xhtml+xml",
    "application/xml",
    "application/xml+rss",
    "application/x-font-opentype",
    "application/x-font-truetype",
    "application/x-font-ttf",
    "application/x-httpd-cgi",
    "application/x-javascript",
    "application/x-mpegurl",
    "application/x-opentype",
    "application/x-otf",
    "application/x-perl",
    "application/x-ttf",
    "font/eot",
    "font/ttf",
    "font/otf",
    "font/opentype",
    "image/svg+xml",
    "text/css",
    "text/csv",
    "text/html",
    "text/javascript",
    "text/js",
    "text/plain",
    "text/richtext",
    "text/tab-separated-values",
    "text/xml",
    "text/x-script",
    "text/x-component",
    "text/x-java-source",
  ]

  # TODO set caching rules, set if missing for 2hr valid and cache every uniq url
  global_delivery_rule {
    cache_expiration_action {
      behavior = "Override"
      duration = "00:02:00"
    }
  }
  origin {
    name = "origin1"
    # storage account url
    host_name = replace(replace(azurerm_storage_account.storage.primary_blob_endpoint, "https://", ""), "/", "")
  }

  depends_on = [azurerm_cdn_profile.profile, azurerm_storage_account.storage]
}

