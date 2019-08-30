import './appcache'
import './browser-policy'
import './fixtures'
import './connectors'

import React from 'react'
import { StaticRouter } from 'react-router'
import { renderToNodeStream, renderToStaticMarkup } from 'react-dom/server'
import { WebApp } from 'meteor/webapp'
import { onPageLoad } from 'meteor/server-render'
import { DataCaptureProvider } from 'meteor/npdev:collections'
import { LoadableCaptureProvider, preloadAllLoadables } from 'meteor/npdev:react-loadable'
import s2s from 'string-to-stream'
import sq from 'streamqueue'
import { HelmetProvider } from 'react-helmet-async'
import { App } from '/imports/App'

h = React.createElement // eslint-disable-line

preloadAllLoadables().then(() => onPageLoad(sink => {
  // if cookie sssr (skip server side rendering) is set, don't bother with ssr
  if (sink.request.cookies.sssr) return

  const context = {}
  const loadableHandle = {}
  const helmetContext = {}
  const dataHandle = {}
  const app = <HelmetProvider context={helmetContext}>
    <StaticRouter location={sink.request.url} context={context}>
      <App />
    </StaticRouter>
  </HelmetProvider>

  // Grab various data from the tree (technique from Apollo's getDataFromTree)
  renderToStaticMarkup(<DataCaptureProvider handle={dataHandle}>
    <LoadableCaptureProvider handle={loadableHandle}>
      {app}
    </LoadableCaptureProvider>
  </DataCaptureProvider>)

  WebApp.addHtmlAttributeHook(() => (
    Object.assign({
      lang: 'en'
    }, helmet.htmlAttributes.toComponent())
  ))

  const { helmet } = helmetContext
  sink.appendToHead(helmet.meta.toString())
  sink.appendToHead(helmet.title.toString())
  sink.appendToHead(helmet.link.toString())

  // :TODO: Figure out how to do helmet.bodyAttributes...

  const queuedStreams = sq(
    () => renderToNodeStream(app),
    () => s2s(loadableHandle.toScriptTag()),
    () => s2s(dataHandle.toScriptTag())
  )
  sink.renderIntoElementById('root', queuedStreams)
}))
