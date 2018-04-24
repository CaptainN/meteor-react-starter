import './appcache'
import './browser-policy'

import { WebApp } from 'meteor/webapp'
import React from 'react'
import { StaticRouter } from 'react-router'
import { renderToNodeStream } from 'react-dom/server'
import { onPageLoad } from 'meteor/server-render'
import Loadable from 'react-loadable'
import s2s from 'string-to-stream'
import sq from 'streamqueue'
import { HelmetProvider } from 'react-helmet-async'
import App from '/imports/App'

h = React.createElement // eslint-disable-line

Loadable.preloadAll().then(() => onPageLoad(sink => {
  const context = {}
  const modules = []
  const modulesResolved = []
  const helmetContext = {}

  const app = <HelmetProvider context={helmetContext}>
    <Loadable.Capture report={(moduleName) => { modules.push(moduleName) }}
      reportResolved={(resolvedModuleName) => { modulesResolved.push(resolvedModuleName) }}>
      <StaticRouter location={sink.request.url} context={context}>
        <App />
      </StaticRouter>
    </Loadable.Capture>
  </HelmetProvider>

  const appStream = renderToNodeStream(app)
  const queuedStreams = sq(
    () => appStream,
    () => s2s(`<script id="__preloadables__">__preloadables__=${JSON.stringify(modulesResolved)};</script>`)
  )
  sink.renderIntoElementById('root', queuedStreams)

  // const { helmet } = helmetContext
  // sink.appendToHead(helmet.meta.toString())
  // sink.appendToHead(helmet.title.toString())
  // sink.appendToHead(helmet.link.toString())

  // WebApp.addHtmlAttributeHook(() => (
  //   Object.assign({
  //     lang: 'en'
  //   }, helmet.htmlAttributes.toComponent())
  // ))

  // :TODO: Figure out how to do helmet.bodyAttributes...
}))
