#!/bin/sh
# @Author: Mike Reich
# @Date:   2015-07-01 02:56:07
# @Last Modified by:   Mike Reich
# @Last Modified time: 2015-07-01 14:49:28

set -e

echo "Running tests"

echo "Testing Core"
cd ./plugins/core
npm test

echo "Testing Client"
cd ../client
npm test

echo "Testing action manager"
cd ../action-manager
npm test

echo "Testing entity extraction"
cd ../entity-extraction
npm test

echo "Testing logging"
cd ../logging
npm test

echo "Testing openfda-source"
cd ../openfda-source
npm test

echo "Testing router"
cd ../router
npm test

echo "Testing storage-mongoose"
cd ../storage-mongoose
npm test