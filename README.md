# Seabourne/Metrostar Systems 18f Pool 2 Prototype

## Introduction

The goal of the Seabourne/Metrostar Pool 2 prototype is to visualize the relationship between different concepts in food safety enforcement actions.

Using a combination of APIs, natural language processing (NLP) tools, data aggregations, and visualization libraries, this prototype demonstrates the feasibility and low level of effort necessary to use open source tools to better understand and represent the relationships between products, ingredients, contaminations and enforcement actions.

## Architecture

The core application is divided into two parts:

1. A data pipeline for consuming and processing data from the OpenFDA API
2. An ExpressJS server that delivers the client to the browser, and uses a JSON based API to deliver data for rendering.

[[Insert Diagram]]

The entire application is built in JavaScript and NodeJS, using MongoDB as the NoSQL document store for the final processed action documents.

The core application is built on a message bus design paradigm, using NodeJS events, with the root application (`app`) object serving as the event dispatcher.

We find this architecture is particularly well suited to data processing tasks because it relies on events to trigger processing actions, ensuring an asynchronous and non-blocking applcation. This means we can process more data (and use more CPU per cycle) because the application is able to process data while waiting on Network and DB IO operations.

### Processing Pipeline

The processing pipeline has three stages:

1. The OpenFDASource plugin loads data from the OpenFDA enforcement actions API.
2. The EntityExtraction plugin uses the Yahoo YQL entity extraction service to identify keywords and terms from the action 'reason_for_recall' field.
3. The ActionManager plugin saves the processed action in the persistent MongoDB data store for processing later.


## Open Source Tools

This project uses the following open source tools:

1. Ubuntu Linux 14.04
1. Docker/Dokku
1. JavaScript
1. NodeJS
1. MongoDB
1. ExpresJS
1. D3
1. Bootstrap

## Next Steps

