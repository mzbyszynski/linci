# linci
Experiments in setting up a greenfield project that supports continuous deployment from the beginning.

## Why
Recently I've had the opportunity to work on some applications as they started or soon after they started. In all cases (in my experience) these applications started out great but hit a "sophomore slump" period where the weight of previous technical choices and just the cumulative code and data of a year or two of development left the application slow to develop, slow to deploy and very susceptible to regression errors. Moreover some choices that were fine when the application was new had led to cumbersome process. One example of this is the standard multi-environment setup: 
1. Pull requests merge into the main branch and are deployed in an integration environment usually named "dev" or "test".
1. Change in that environment are promoted into another environment that is intended to more closely mirror production, often called "staging" or "uat".
1. After a testing, QA or user acceptance process the changes in that environment are promoted to production.

What I have seen over time is that working with each environment becomes challenging because of data, leading to situations where any testing in a lower environment requires time-consuming data setup, or else the tests are of dubious value because the data cannot be trusted to actually compare with what is in production. In general the promotion process between environments is slow and involves many manual steps, even when continuous integration or continuous delivery to the lower environments has been implemented.

Continuous Deployment is a powerful concept that seems to like it could alleviate some of the problems, but I have
not found much in the way of tooling for developers to set up and follow a practice that would enable this in 
a safe way.

I wonder if you could set up an environment with sufficient tooling to enable continuous delivery to a __single__ environment that would replace the multi-environment process but still allow for high-confidence production delivery of software changes and the ability to quickly address any bugs or regression errors that do make it through the pipeline. 

This repo is a fake, distributed application that I have set up to see if I can do this.

## Goals
1. Single Environment that supports testing and production.
1. Robust automation and tooling that makes it easy to add automated component tests and end-to-end integration tests, and possibly also enforces certain testing requirements.
1. All feature exposure to end users should be controllable by a feature flag service that can be managed by engineers, operations, product owners or other stakeholders independently from code deployment.
1. Some way to also integrate canary deployments/data etc. as another strategy for detecting defects.
1. Developing in this environment should be fun and fast with minimal boilerplate and waiting around.

## Reference Application
The reference application is a contrived example of a distributed web application that leverages several different langues and frameworks. If I were building an purposeful application I would most likely not choose all these different technologies. So the choices made in how this reference application has been implemented are solely in service of the experiment described above and intended to make sure they take into account some different languages to see if there are any pieces that are more conducive to this kind of development/deployment practice than others.
The reference application might also not _do_ that much since complex functionality is not needed beyond illustrating the continuous deployment process.

### Some Reference Application Constraints
1. Should be able to run the whole thing locally.
1. Should be able to run an instance of it for free.

## The Plan (WIP)

1. Setup Initial version of distributed application
    - [x] Create local environment with docker compose
    - [x] Add Postgres and flyway for db migrations
    - [x] Add backend graphql server using Kotlin and Spring Boot
    - [x] Working POC of automated tests for graphql server
    - [ ] Add some kind of OAuth implementation to authenticate with third party and store some unique user identifier.
    - [ ] Create frontend using parts of EPIC stack.
    - [ ] Implement integration tests that test the whole stack
    - [ ] Add multi-tenancy concept to application as would be needed for typical SaaS.
    - [ ] Add monitoring/tracing solution for detecting errors
1. Enabling Continuous Delivery
    - [ ] Add Feature flag service
    - [ ] Add Some cross-cutting feature to reference application that will use feature flags
    - [ ] Set up some strategy for canary data/accounts
    - [ ] Consider a way to implement automated performance tests
1. Negative Testing
    - [ ] Create some changes that cause functional issues to test monitoring feedback loop.
    - [ ] Create changes that cause performance issues to test monitoring feedback loop.
1. Recipes
    - [ ] Identify possible recipes, rules or tools that could make adhering to this process easier

## Local Development
_WIP_, but here are some commands:

### Start GraphQL Server
```bash
cd graphql
# Builds the graphql container using jib
./gradlew build
cd ..
docker compose up graphql
```
Then go to http://localhost:18080/graphiql

### Stop everything and clean up
```bash
docker compose down --remove-orphans -v
```