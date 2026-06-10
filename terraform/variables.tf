variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus2"
}

variable "resource_group_name" {
  description = "Name of the main resource group"
  type        = string
  default     = "constelaciones-rg"
}

variable "cosmos_account_name" {
  description = "Globally unique name for the Cosmos DB account"
  type        = string
  default     = "constelaciones-db"
}

variable "storage_account_name" {
  description = "Globally unique name for the Storage account (lowercase, no dashes, max 24 chars)"
  type        = string
  default     = "constelacionesstorage"
}

variable "static_web_app_name" {
  description = "Name for the Azure Static Web App"
  type        = string
  default     = "constelaciones-app"
}

variable "communication_service_name" {
  description = "Name for Azure Communication Services"
  type        = string
  default     = "constelaciones-comms"
}

variable "email_service_name" {
  description = "Name for Azure Email Communication Service"
  type        = string
  default     = "constelaciones-email"
}
