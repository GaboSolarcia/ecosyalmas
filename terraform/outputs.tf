output "cosmos_connection_string" {
  description = "Cosmos DB primary connection string — add to GitHub secret MONGODB_URI"
  value       = azurerm_cosmosdb_account.db.primary_mongodb_connection_string
  sensitive   = true
}

output "storage_connection_string" {
  description = "Blob Storage connection string — add to GitHub secret AZURE_STORAGE_CONNECTION_STRING"
  value       = azurerm_storage_account.main.primary_connection_string
  sensitive   = true
}

output "storage_account_name" {
  description = "Storage account name"
  value       = azurerm_storage_account.main.name
}

output "static_web_app_url" {
  description = "Your app's public URL — use as NEXTAUTH_URL"
  value       = "https://${azurerm_static_web_app.app.default_host_name}"
}

output "static_web_app_api_token" {
  description = "Deployment token — add to GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN"
  value       = azurerm_static_web_app.app.api_key
  sensitive   = true
}

output "email_domain" {
  description = "Your Azure-managed email sending domain — use as EMAIL_FROM domain"
  value       = azurerm_email_communication_service_domain.main.mail_from_sender_domain
}

output "communication_service_connection_string" {
  description = "ACS connection string — use for email SDK"
  value       = azurerm_communication_service.main.primary_connection_string
  sensitive   = true
}
