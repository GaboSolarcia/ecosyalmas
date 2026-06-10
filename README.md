# Ecos y Almas

Web application for Constelaciones Familiares sessions — booking, payments, and admin management.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Azure Cosmos DB (MongoDB API, free tier)
- **Storage**: Azure Blob Storage (photos)
- **Email**: Azure Communication Services
- **Payments**: Stripe
- **Hosting**: Azure Static Web Apps (free tier)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions

## Local development

1. Copy the env template and fill in values:
   ```bash
   cp .env.local.example .env.local
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Infrastructure

All Azure resources are provisioned with Terraform. See `terraform/` for the full configuration.

To provision from scratch, see the bootstrap instructions in `terraform/bootstrap.sh`.

## Deployment

Every push to `main` triggers two GitHub Actions workflows:
- `terraform.yml` — provisions/updates Azure infrastructure (only when `terraform/` changes)
- `deploy.yml` — builds and deploys the Next.js app to Azure Static Web Apps
