#!/bin/bash
set -e

echo "Installing Core"
cd ./plugins/core
npm install

echo "Installing Client"
cd ../client
npm install

echo "Installing action manager"
cd ../action-manager
npm install

echo "Installing entity extraction"
cd ../entity-extraction
npm install

echo "Installing logging"
cd ../logging
npm install

echo "Installing openfda-source"
cd ../openfda-source
npm install

echo "Installing router"
cd ../router
npm install

echo "Installing storage-mongoose"
cd ../storage-mongoose
npm install

echo "Done Installing"
