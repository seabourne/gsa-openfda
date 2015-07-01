# Seabourne/Metrostar Systems 18f Pool 2 Prototype

## Introduction

The goal of the Seabourne/Metrostar Pool 2 prototype is to visualize the relationship between different concepts in food safety enforcement actions.  Ideally, this approach will help FDA stakeholders explore the relationship between key reasons for recalls (for example, fatal infections due to ingestion of the product) and other factors (like presence of listeria in peanut products). 

Using a combination of APIs, natural language processing (NLP) tools, data aggregations, and visualization libraries, this prototype demonstrates the feasibility and low level of effort necessary to use open source tools to better understand and represent the relationships between products, ingredients, contaminations and enforcement actions.

### Moving beyond structured data

Our approach is a demonstration of how natural language processing approaches and technologies can help Federal Agencies move beyond the limits of structured (or poorly structured) data. Analyzing, and visualizing data, does not necessarily have to begin with a time-consuming and expensive data cleansing and ETL processing. Instead, newer technologies, including NLP and machine learning, are lowering the technology and cost barriers to getting the most out of any type of data.

This prototype took less than 25 person hours to develop, from concept through to deliver, and we hope that it provides a tangible (and interesting) demonstration of the many great things that can be done today using APIs, open source tools and data.

## Usage

The prototype uses a Chord visualization to show the relationship between different keywords extracted from enforcement actions. The diagram shows, for example, that 'fatal infections' are most strongly correlated with 'young children' in enforcement actions.

To use the Chord diagram, simply move your mouse over a category on the outer edge of the diagram. This will highlight the different connections. The thickness of the connections shows how strongly the two terms are related (as measured by how often they show up together in the same enforcement action report). You can hover over the chord itself to see how many times the terms were found together.

## Installation

### System Requirements

1. NodeJS
2. MongoDB

### Install

```
> npm install
```

### Configuration

The app assumes you are running a MongoDB service locally on the standard 27017 port.  If you wish to change this to use a different MongoDB server, enter the connection string in the root package.json file `config` attribute.

### Data Loading

By default, the application loads data to initialize the database.  If you would like to force reload the data, set the `RESET_ACTIONS` env variable on startup. This will wipe the existing data and reload/update the data set.

### Data Aggregation

By default, the aggregations will load on the first page load.  If you would like to update the data aggregations used to render the visualizations, navigate to `/api/generate`. This will reset the internal matrix maps.

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

We think this prototype presents numerous interesting next steps, both for expanding the visualization capabilities, but also to integrate more advanced machine learning and NLP tools to improve the volume and fidelity of processing.

1. Add in drill-down capabilites. The application provides a high-level overview of the relationship between keywords extracted from enforcement actions. However, a clear need is to be able to drill-down to further levels of detail. This could be done as new enforcement action specific detail screens, or as part of the existing visualizations.
1. Include additional NLP/ML tools. Because of the specific nature of the data, there is quite a bit of room for improvement in the accuracy of the keyword identification. However, this will take additional time and data to train the NLP models.
1. Include decision support tools. One exciting next step could be the inclusion of decision support tools based on the data. Because we can draw correlations between particularl events (like infection of children) and other factors, it would be relatively simple to feed the existing pipeline into a ML model for assigning predictive scores for events that are likely to result in significant publicity or public harm.

## License

The MIT License (MIT)

Copyright (c) 2015 Seabourne Consulting LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
