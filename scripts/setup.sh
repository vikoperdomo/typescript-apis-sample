. ./.env.setup

# Create a resource group to contain anything
az group create --name $AZURE_RESOURCE_GROUP --location $LOCATION

# Deploy base
az deployment group create \
  --name $DEPLOYMENT_NAME \
  --resource-group $AZURE_RESOURCE_GROUP  \
  --template-file $TEMPLATE_PATH \
  --parameters @$PARAMETERS_PATH

# Create SQL database
az cosmosdb sql database create \
  --account-name $COSMOSDB_ACCOUNT_NAME \
  --name $COSMOSDB_DB_NAME \
  --resource-group $AZURE_RESOURCE_GROUP\
  --throughput $THROUGHPUT

# Create SQL container
az cosmosdb sql container create \
  --account-name $COSMOSDB_ACCOUNT_NAME \
  --database-name $COSMOSDB_DB_NAME \
  --name $COSMOSDB_CONTAINER_NAME \
  --partition-key-path $PARTITION_KEY_PATH \
  --resource-group $AZURE_RESOURCE_GROUP \
  --throughput $THROUGHPUT

# az storage account create \
#   --name $STORAGE_ACCOUNT_NAME \
#   --resource-group $AZURE_RESOURCE_GROUP \
#   --location $LOCATION \
#   --sku Standard_RAGRS \
#   --kind StorageV2

# List connections strings and endpoints
# Put those values in "src/config.ts"
az cosmosdb keys list \
  --name $COSMOSDB_ACCOUNT_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --type connection-strings