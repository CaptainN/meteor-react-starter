/* global Meteor */
import './service-worker'

import { onPageLoad } from 'meteor/server-render'
import React from 'react'
import Loadable from 'react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { DataHydrationProvider, hydrateData } from 'meteor/npdev:collections'

h = React.createElement // eslint-disable-line

onPageLoad(async sink => {
  import { App } from '/imports/App'

  if (window.__preloadables__) {
    await Loadable.preloadablesReady(window.__preloadables__)
  }

  hydrateData()

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
