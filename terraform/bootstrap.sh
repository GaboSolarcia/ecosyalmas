#!/bin/bash
# Run this ONCE before any Terraform commands.
# It creates the storage account that holds your Terraform state.
# After running, copy the printed storage account name into providers.tf

set -e

LOCATION="eastus2"
RG="tfstate-rg"
# Generate a unique name (storage accounts must be globally unique, lowercase, max 24 chars)
STORAGE="tfstate$(openssl rand -hex 5)"
CONTAINER="tfstate"

echo "Creating Terraform state infrastructure..."
echo "Resource group : $RG"
echo "Storage account: $STORAGE"
echo ""

az group create \
  --name "$RG" \
  --location "$LOCATION" \
  --output none

az storage account create \
  --name "$STORAGE" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --output none

az storage container create \
  --name "$CONTAINER" \
  --account-name "$STORAGE" \
  --output none

echo ""
echo "✅ Done! Now do two things:"
echo ""
echo "1. Open terraform/providers.tf and set:"
echo "     storage_account_name = \"$STORAGE\""
echo ""
echo "2. Add this as a GitHub secret:"
echo "     Name : TF_BACKEND_STORAGE_ACCOUNT"
echo "     Value: $STORAGE"
