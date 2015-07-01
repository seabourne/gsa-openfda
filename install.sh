#!/bin/bash
set -e

echo "Installing Root"
npm install

echo "Installing Core"
cd ./plugins/core
npm install

echo "Installing Client"
cd ./plugins/client
npm install

echo "Installing action manager"
cd ./plugins/action-manager
npm install

echo "Installing entity extraction"
cd ./plugins/entity-extraction
npm install

echo "Installing logging"
cd ./plugins/logging
npm install

echo "Installing openfda-source"
cd ./plugins/openfda-source
npm install

echo "Installing router"
cd ./plugins/router
npm install

echo "Installing storage-mongoose"
cd ./plugins/storage-mongoose
npm install

echo "Done Installing"
