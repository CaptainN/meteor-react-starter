import './apollo'
// import './appcache'
import './browser-policy'

import { WebApp } from 'meteor/webapp'
import React from 'react'
import { StaticRouter } from 'react-router'
import { onPageLoad } from 'meteor/server-render'
import Loadable from 'react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { schema } from '/imports/api/apollo/schema'
import { resolvers } from '/imports/api/apollo/resolvers'
import App from '/imports/App'

h = React.createElement // eslint-disable-line

Loadable.preloadAll().then(() => onPageLoad(async sink => {
  try {
    const defaultState = {}
    const cache = new InMemoryCache()
    const stateLink = withClientState({
      cache,
      resolvers,
      defaults: defaultState
    })
    const schemaLink = new SchemaLink({ schema })
    const link = from([stateLink, schemaLink])
    const client = new ApolloClient({
      ssrMode: true,
      link,
      cache
    })

    const context = {}
    const modules = []
    const modulesResolved = []
    const helmetContext = {}
    const app = <ApolloProvider client={client}>
      <HelmetProvider context={helmetContext}>
        <Loadable.Capture
          report={moduleName => {
            modules.push(moduleName)
          }}
          reportResolved={resolvedModuleName => {
            if (
              modulesResolved.findIndex(
                mod => mod[0] === resolvedModuleName[0]
              ) === -1
            ) {
              modulesResolved.push(resolvedModuleName)
            }
          }}
        >
          <StaticRouter location={sink.request.url} context={context}>
            <App />
          </StaticRouter>
        </Loadable.Capture>
      </HelmetProvider>
    </ApolloProvider>
    const content = await renderToStringWithData(app)
    sink.renderIntoElementById('root', content)
    sink.appendToBody(`<script id="__preloadables__">__preloadables__=${JSON.stringify(modulesResolved)}</script>`)
    sink.appendToBody(`<script>__APOLLO_STATE__=${JSON.stringify(client.extract())}</script>`)

    const { helmet } = helmetContext
    sink.appendToHead(helmet.meta.toString())
    sink.appendToHead(helmet.title.toString())
    sink.appendToHead(helmet.link.toString())

    WebApp.addHtmlAttributeHook(() => (
      Object.assign({
        lang: 'en'
      }, helmet.htmlAttributes.toComponent())
    ))

    // :TODO: Figure out how to do helmet.bodyAttributes...
  } catch (e) {
    console.error(e)
  }
}))
