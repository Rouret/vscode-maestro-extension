#!/bin/bash

# Définissez le chemin d'accès au fichier JSON
jsonFile="./config/maestro.code-snippets.json"

# Définissez le chemin d'accès au fichier README.md
readmeFile="OUTPUT.md"

# Vérifiez si jq est installé
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install it to proceed."
    exit
fi

# Commencer un nouveau README.md avec le titre

# Get the content of the file BASE_README.md
> "$readmeFile"

# Ajouter le tableau en markdown au README.md
{
    echo ""
    echo "## Command Prefixes and Descriptions"
    echo ""
    echo "| Prefix | Description |"
    echo "|--------|-------------|"
    jq -r '.[] | "\(.prefix) | \(.description // "N/A") |"' "$jsonFile"
} >> "$readmeFile"
