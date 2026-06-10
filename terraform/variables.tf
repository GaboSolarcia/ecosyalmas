variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus2"
}

variable "resource_group_name" {
  description = "Name of the main resource group"
  type        = string
  default     = "ecosyalmas-rg"
}

variable "cosmos_account_name" {
  description = "Globally unique name for the Cosmos DB account"
  type        = string
  default     = "ecosyalmas-db"
}

variable "storage_account_name" {
  description = "Globally unique name for the Storage account (lowercase, no dashes, max 24 chars)"
  type        = string
  default     = "ecosyalmastorage"
}

variable "static_web_app_name" {
  description = "Name for the Azure Static Web App"
  type        = string
  default     = "ecosyalmas-app"
}

variable "communication_service_name" {
  description = "Name for Azure Communication Services"
  type        = string
  default     = "ecosyalmas-comms"
}

variable "email_service_name" {
  description = "Name for Azure Email Communication Service"
  type        = string
  default     = "ecosyalmas-email"
}

variable "alert_email" {
  description = "Email address to receive budget alerts"
  type        = string
  default     = "gabosolarcia@gmail.com"
}

variable "monthly_budget_usd" {
  description = "Monthly spending limit in USD"
  type        = number
  default     = 2
}
