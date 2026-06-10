# ─── Resource Group ────────────────────────────────────────────────────────────
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# ─── Cosmos DB (MongoDB API — Free Tier) ───────────────────────────────────────
resource "azurerm_cosmosdb_account" "db" {
  name                = var.cosmos_account_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"
  free_tier_enabled   = true  # MUST be set at creation — cannot change later
  mongo_server_version = "7.0"

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = "constelaciones"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.db.name

  autoscale_settings {
    max_throughput = 1000 # stays within free tier (1000 RU/s)
  }
}

# ─── Blob Storage (photos) ─────────────────────────────────────────────────────
resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
      allowed_origins    = ["*"] # restrict to your domain after launch
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

resource "azurerm_storage_container" "photos" {
  name                  = "photos"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "blob" # anonymous read for images
}

# ─── Azure Communication Services ──────────────────────────────────────────────
resource "azurerm_communication_service" "main" {
  name                = var.communication_service_name
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "United States"
}

resource "azurerm_email_communication_service" "main" {
  name                = var.email_service_name
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "United States"
}

resource "azurerm_email_communication_service_domain" "main" {
  name             = "AzureManagedDomain"
  email_service_id = azurerm_email_communication_service.main.id
  domain_management = "AzureManaged"
}

resource "azurerm_communication_service_email_domain_association" "main" {
  communication_service_id = azurerm_communication_service.main.id
  email_service_domain_id  = azurerm_email_communication_service_domain.main.id
}

# ─── Azure Static Web Apps ─────────────────────────────────────────────────────
resource "azurerm_static_web_app" "app" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = "eastus2"
  sku_tier            = "Free"
  sku_size            = "Free"
}
