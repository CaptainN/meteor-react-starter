Meteor Apollo React Starter
===========================

This is my starter. It contains all the necessary components to acheive the desired feature set, with some boilerplate to implement those settings.

Features
--------

 * Meteor as the core build system and development and application platform.
 * Accounts (auth) system using Meteor's `accounts-base`
 * Perfect code splitting using Meteor's `dynamic-imports`
 * Server side rendering (SSR) using Meteor's `server-render`
 * Up to date, zero config ecmascript (es6, es7, es+) with modern and legacy builds.
 * SASS/SCSS with autoprefixer
 * Offline with Meteor's `appcache`
 * Includes a default service-worker
 * React as the view platform
 * React Router for routing
 * React Helmet for html head management
 * React Loadable configured at route level for perfect code slitting
 * Browser Policy with some common URLs commented out
 * Apollo as default data transport
 * Apollo for schema definitions
 * Meteor's DDP enabled by default (see below for instructions to disable)
 * Mongo DB as default data tier
 * eslint config based on "standard style" with some minor changes
 * npm scripts for local dev, and local debug
 * Layout based routing templates (similar to standard Flow Router setups)
 * VS Code debug for macOS node and Opera
 * Uses Meteor 1.7's mainModule entry points, but maintains Meteor's default folder structure
 * Use jsx pragma to avoid having to import React everywhere
 * All build config (eslint, babel, browserslist, scss, meteor, etc.) in package.json

About SSR and Node Streams

Server Side Rendering (SSR) is tricky with React and Node when you include features like React Helmet, and React Loadable for code splitting. These tools require the entire tree to be rendered in order to extract necessary data like the title of a route (Helmet), or the set of dynamic modules needed to render the current route. There are a few things worth understanding to shed light on why it's so complex.

First, React Loadable. In order to properly render the entire tree for a given route, it's necessary to load all the "Loadables" used in a given route, before the tree is rendered. Otherwise you'll get a bunch of truncated branches which end on Loadable's Loading component. On the server this is easy enough - we can just preload all the Loadables at once, and leave them in memory while the server runs. On the client, we don't want to preload everything though, because that would defeat the point of using Loadable and dynamic-imports - to load only the components we need now (code splitting). To work around that, we must record a list of the Loadables used to render the current route on the server, and pass that on to the client. The client can then take up that list, and preload the minimum set of modules to "hydrate" the HTML it received from the server. If we skip this preloading step, we'll get a "flash of loading". It's also faster to load all the needed components/modules at once than it wold be to load them in serial as needed, which is a great side bonus.

Most of the same consideration applies to React Helmet. We need to render the whole tree for the current route, and record all the uses of Hemlet, then insert those values into the output HTML on the server. Helmet has an additional concern that Loadable does not, in that it must render upstream - Helmet is used to modify tags in the `head` area of the html page.

With React.renderToString, this is pretty straight forward. The server (Meteor) can render the entire app tree to a string, and then set up it's outputs as needed ahead of time, including the stuff in the head area of the html page for Helmet, then flush everything to the client. With React.renderToNodeStream things are more challenging. We can't know before the tree is flushed to the client which head tags and which Loadables to output, so we have to do some additional work. For Loadables it's easy enough - we can use a stream queue to make sure we don't try to get the list of Loadables until the react stream is complete, then append the necessary code to the output stream. For Helmet it's more tricky. We basically cannot work with streams at all and perfectly generate the <head> elements we need, because we can't rewind a stream which has already been sent to the client.

To get React Helmet to work with streams, we'll cache the Helmet output, and use `renderToString` for the first pass (empty cache), and only use `renderToNodeStream` on subsequent passes. We'll accept that sometimes, for a single request when the data has changed, and it has not updated the cache, we'll deliver an outdated title or other meta data (unless we implement some more robust cache invalidation).

You can find an unfinished version of stream support using `renderToNodeStream` for output instead of a `renderToString` on the "renderToNodeStream" branch. While the basics are working (including React-Loadable support), it's not finished because there Helmet support (caches) has not been completed.

If you are curious, google "renderToNodeStream react node" and you'll find plenty of posts explaining why you might want to use streams. It may also be true that certain web front end caches (CDNs and WAP) can alleviate the need for this altogether - I'm not sure yet.
