#!/usr/bin/env node

import './ts-paths-bootstrap'

import { AppInsights } from 'modules/app-insights'
// App Insights needs to be enabled as early as possible as it monitors other libraries as well
new AppInsights().enable()

import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { app } from './app'
import { ApplicationCluster } from './applicationCluster'
import { ApplicationRunner } from './applicationRunner'

if (toBoolean(config.get<boolean>('featureToggles.clusterMode'))) {
  ApplicationCluster.execute(() => ApplicationRunner.run(app))
} else {
  ApplicationRunner.run(app)
}
