## Weather Tracker (Develop Azure compute solutions)

### screenshot

![Screenshot](<weater-tracker(az-compute)/screenshot.png>)

A web application that allows users to track weather updates in real-time for their chosen cities. The system also triggers Azure Functions for alerts(sending email) when a specific weather threshold is met (like if it's windy).

### Architecture

![Architecture](<weater-tracker(az-compute)/achitect.png>)

### Infrastructure

- Azure App Service Web App (Hosting the web application)
- Azure Container Registry (Storing Docker images for the app)
- Azure Container Instance (Running the containers for development/testing)
- Azure Functions (Weather alert system)
- Azure Container Apps (Running the containers in production)

### Diagram

```
User
|-> Web Application (Hosted on Azure App Service Web App)
   |-> Weather Alerts (Azure Functions)
      |-> Docker Images (Azure Container Registry)
         |-> Testing Containers (Azure Container Instance)
            |-> Running Containers (Azure Container Apps)
```

### Implementation Guide

1. Create an Azure App Service Web App.
2. Develop a basic web application that uses weather APIs.
3. Containerizable frontend.
4. Publish the container image to Azure Container Registry.
5. Test the application using Azure Container Instance.
6. Implement an Azure Function to send alerts when a specified weather threshold is met.
7. Integrate Azure Function with your web application.
8. Deploy the web application to Azure Container Apps.
9. Setup a CI/CD pipeline for your application and Function.
10. Setup Application insights
11. Push to GitHub
12. Document

## Azure Document Vault with Expiry & CDN Integration (Develop for Azure storage)

<!-- show image from ./screenshot.png -->

![screenshot](/doc-vault-az-storage/screenshot.png)

A secure platform where users can upload important documents, assign tags for easier organization, and retrieve them. This enhanced system integrates expiration dates on shared links and utilizes Azure CDN to deliver content efficiently to users across various regions.

### Infrastructure

- Azure Blob Storage (For storing documents)
- Azure Cosmos DB (For metadata, tags, and expiring link details)
- Azure Functions (To handle link expiration logic)
- Azure CDN (To efficiently deliver documents)

### Diagram

```
[Users]
  |
  V
[Document Upload, Tagging, and Link Generation Portal]
  |    /        \         |
  |   /          \        |
  V  V            V       V
[Azure Blob Storage]--[Azure CDN]--[Azure Cosmos DB]--[Azure Functions]
```

### Implementation Guide

1.  Design Document Uploader Interface:
    - Create a user-friendly interface for document uploads and tagging.
2.  Azure Blob Storage Setup:
    - Set up Azure Blob Storage containers for document storage.
    - Implement authentication and authorization.
3.  Azure Cosmos DB Integration:
    - Initialize Azure Cosmos DB.
    - Store metadata for each document upload, like the upload date, document type, user ID, and tags.
4.  Develop Document Upload and Tagging Portal:
    - Build a portal where users can upload and tag documents.
    - Use SDKs to communicate with Blob Storage and Cosmos DB.
5.  Develop Expiration Logic with Azure Functions:
    - Allow users to generate unique download URLs with set expiration dates.
    - The function will store the URL, associated document reference, and expiration in Cosmos DB.
6.  Modify Document Retrieval:
    - Check the URL's validity and serve the document either directly from Azure Blob Storage or via Azure CDN.
7.  Setup Azure CDN:
    - Create a CDN profile and endpoint.
    - Link it to Azure Blob Storage.
8.  Modify Document Serving Logic with CDN:
    - Use Azure CDN to cache and deliver documents, enhancing the retrieval speed.
9.  Manage Cache Lifespan:
    - Set appropriate TTL (Time to Live) for cached documents on CDN.
10. Setup a CI/CD pipeline for your application and Function.
11. Setup Application insights and Azure monitor
12. Push to GitHub
13. Document

## Azure App Setup Guide

Follow the steps below to set up your Azure App:

1. Fork this repository and clone it to your local machine.
2. Navigate to the `terraform` folder and run `terraform apply` to provision the required infrastructure.
3. Obtain the publish key for your Azure Function and save it as a secret named `DOC_VAULT_AZURE_FUNCTIONAPP_PUBLISH_PROFILE` in your GitHub repository. This key will be used by the GitHub Actions workflow to enable continuous integration and deployment for your Azure Function.
4. Make a commit to trigger the CI/CD workflow. Once the workflow completes, verify that your three Azure Functions have been successfully deployed.
5. Retrieve the base URL for the `download` function and assign it to the Azure Static Web App that was just created. Set it as the value for the variable `NEXT_PUBLIC_DOC_VAULT_FUNCTION_DOWNLOAD_URL` in your Azure Static Web App configuration (also add it to the local `.env` file).
