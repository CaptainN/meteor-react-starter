import { client } from './apollo'
import './service-worker'

import { onPageLoad } from 'meteor/server-render'
import React from 'react'
import Loadable from 'react-loadable'
import { ApolloProvider } from 'react-apollo'
import { HelmetProvider } from 'react-helmet-async'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

h = React.createElement // eslint-disable-line

onPageLoad(async () => {
  let App = (await import('/imports/App')).default

  if (window.__preloadables__) {
    await Loadable.preloadablesReady(window.__preloadables__)
    // Clean up after Preloadables
    const script = document.getElementById('__preloadables__')
    script.parentNode.removeChild(script)
    delete window.__preloadables__
  }

  const helmetContext = {}
  hydrate(<ApolloProvider client={client}>
    <HelmetProvider context={helmetContext}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </ApolloProvider>, document.getElementById('root'))
})
