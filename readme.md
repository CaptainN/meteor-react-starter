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

Note about SSR and streaming

  // :TODO: Use streaming, and cached data. If streaming, the module and helmet data will not be
  // available until the entire tree is rendered, which will not happen until after head tags are
  // already sent. We'll need to cache this, and then use the data from the cache. This means the
  // first request will not receive the data, but since these are static routes, and builds are
  // not deployed often, it's an acceptable trade off.
