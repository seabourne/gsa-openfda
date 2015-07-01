# Installation Guide

## System Requirements

1. NodeJS
2. MongoDB

## Installation

```
> npm install
```

## Configuration

The app assumes you are running a MongoDB service locally on the standard 27017 port.  If you wish to change this to use a different MongoDB server, enter the connection string in the root package.json file `config` attribute.

## Data Loading

By default, the application loads data to initialize the database.  If you would like to force reload the data, set the `RESET_ACTIONS` env variable on startup. This will wipe the existing data and reload/update the data set.

## Data Aggregation

By default, the aggregations will load on the first page load.  If you would like to update the data aggregations used to render the visualizations, navigate to `/api/generate`. This will reset the internal matrix maps.