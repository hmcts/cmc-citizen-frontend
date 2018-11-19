# E2E refactoring (to come soon...)

- BDD - https://github.com/hmcts/ia-ccd-e2e-tests (from Pragnesh)
- Feature toggle detection - refactor into a more codecept.io way -  - using hooks (event.all.before) to detect toggle and set global variable. I couldn’t get it working!
- Feature toggle - its hard coded for admissions - refactor so can detect any toggle
- E2E architecture - how we do BDD has impact on this. But common DTOs - e.g. test data, components/journeys - e.g. statement of means, defence: refactor out of e2e tests into components, feature based maybe - or maybe too much overlap?

Update:

Had to change approach to environment variables
