/* global Meteor */
import './service-worker'
import './sssr-cookie'

import { onPageLoad } from 'meteor/server-render'
import React from 'react'
import { preloadLoadables } from 'meteor/npdev:react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { DataHydrationProvider, hydrateData } from 'meteor/npdev:collections'

h = React.createElement // eslint-disable-line

onPageLoad(async sink => {
  import { App } from '/imports/App'

  // start to preload loadables
  const promisables = preloadLoadables()

  // hydrate the data while we are waiting
  hydrateData()

  // finish waiting
  await promisables

  const helmetContext = {}
  const hydrationHandle = { isHydrating: !Meteor.userId() }
  hydrate(
    <DataHydrationProvider handle={hydrationHandle}>
      <HelmetProvider context={helmetContext}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </DataHydrationProvider>,
    document.getElementById('root')
  )
})
