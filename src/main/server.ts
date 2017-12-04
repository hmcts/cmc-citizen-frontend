#!/usr/bin/env node

import './ts-paths-bootstrap'
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
