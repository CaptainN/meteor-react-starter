import './appcache'
import './browser-policy'
import './fixtures'
import './connectors'

import React from 'react'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { WebApp } from 'meteor/webapp'
import { FastRender } from 'meteor/staringatlights:fast-render'
import { DataCaptureProvider } from 'meteor/npdev:collections'
import { LoadableCaptureProvider, preloadAllLoadables } from 'meteor/npdev:react-loadable'
import s2s from 'string-to-stream'
import sq from 'streamqueue'
import { HelmetProvider } from 'react-helmet-async'
import { App } from '/imports/App'

h = React.createElement // eslint-disable-line

preloadAllLoadables().then(() => FastRender.onPageLoad(sink => {
  const context = {}
  const loadableHandle = {}
  const helmetContext = {}
  const dataHandle = {}
  const app = <HelmetProvider context={helmetContext}>
    <StaticRouter location={sink.request.url} context={context}>
      <App />
    </StaticRouter>
  </HelmetProvider>

  // Grab various data from the tree. We are rendering to string because
  // renderToNodeStream causes problems with Mongo. It's only slightly
  // less efficient than renderToStaticMarkup (which is what Apollo uses
  // by default), and we get to skip the second pass with
  // renderToNodeStream anyway - bonus!
  const html = renderToString(<DataCaptureProvider handle={dataHandle}>
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

  // Since we have already rendered to string, is this more efficient than
  // just writing to sink? I don't know yet...
  const queuedStreams = sq(
    () => s2s(html),
    () => s2s(loadableHandle.toScriptTag()),
    () => s2s(dataHandle.toScriptTag())
  )
  sink.renderIntoElementById('root', queuedStreams)
}))
