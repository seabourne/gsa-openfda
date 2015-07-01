# Seabourne/Metrostar Systems 18f Pool 2 Prototype

## Introduction

The goal of the Seabourne/Metrostar Pool 2 prototype is to visualize the relationship between different concepts in food safety enforcement actions.

Using a combination of APIs, natural language processing (NLP) tools, data aggregations, and visualization libraries, this prototype demonstrates the feasibility and low level of effort necessary to use open source tools to better understand and represent the relationships between products, ingredients, contaminations and enforcement actions.

## Architecture

### System

The application has been deployed on an Amazon Web Services EC2 (small) instance, running Ubuntu LTS 14.04. We used Dokku to provide a Heroku-like, Docker based containerization system that uses Git pushes to trigger build and loading dependencies.  Dokku is open-sourced, and ensures our single-instance apps can be appropriately containerized and deployed using fixed dependencies from NPM.

### Configuration Management

We use NPM as our configuration and dependency management tool, to ensure that all versions of NodeJS libraries are consistent from development to deployment. The NPM package.json file also includes all application configuration necessary for different deploy environments (primarily local, test and production).

### Continuous Integration and Monitoring

We are using two techniques for continuous integration and monitoring. The first is a Jenkins-based CI/CD system where tests are run automatically based on GitHub deploy webhooks.  We also use Dokku's native CHECKS system to ensure that deployments and underlying system components have been properly configured before finalizing the new docker instance and retiring the previous instance. Our unit testing system is based on Mocha, Should and Superagent.

Continuous monitornig is provided by AWS Cloudwatch, both to measure system performance and applicaiton uptime.

### Application

The core application is divided into two parts:

1. A data pipeline for consuming and processing data from the OpenFDA API
2. An ExpressJS server that delivers the client to the browser, and uses a JSON based API to deliver data for rendering.

The entire application is built in JavaScript and NodeJS, using MongoDB as the NoSQL document store for the final processed action documents.

The core application is built on a message bus design paradigm, using NodeJS events, with the root application (`app`) object serving as the event dispatcher.

We find this architecture is particularly well suited to data processing tasks because it relies on events to trigger processing actions, ensuring an asynchronous and non-blocking applcation. This means we can process more data (and use more CPU per cycle) because the application is able to process data while waiting on Network and DB IO operations.

### Processing Pipeline

The processing pipeline has three stages:

1. The OpenFDASource plugin loads data from the OpenFDA enforcement actions API.
2. The EntityExtraction plugin uses the Yahoo YQL entity extraction service to identify keywords and terms from the action 'reason_for_recall' field.
3. The ActionManager plugin saves the processed action in the persistent MongoDB data store for processing later.

### Front-end Display

The front-end is a combination of server-side rendered EJS files, and client side Javascript which loads data via REST APIs.  On page load, the server bootstraps the initial page with data to improve page loading time, then the client loads the keyword and matrix data via API calls.

We are using D3 as the main visualization library, along with other open source libraries like JQuery and Bootstrap for UI/UX elements.

## Open Source Tools

This project uses the following open source tools:

1. Ubuntu Linux 14.04
1. Docker/Dokku
1. JavaScript
1. NodeJS
1. MongoDB
1. ExpresJS
1. D3
1. Bootstrap/JQuery

## Team

* Project Lead/Senior Developer: Mike Reich
* Poduct Manager: Dan Nicollet
* DevOps/Backend Developer: Scott Maxson

## Next Steps

