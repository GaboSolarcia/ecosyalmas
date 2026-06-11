terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstateecosyalmas"
    container_name       = "tfstate"
    key                  = "ecosyalmas.tfstate"
  }
}

provider "azurerm" {
  # Explicitly use Service Principal — never fall back to Azure CLI
  use_cli  = false
  use_msi  = false
  use_oidc = false

  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}
