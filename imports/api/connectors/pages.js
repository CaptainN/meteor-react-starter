import { check } from 'meteor/check'
import { createConnector } from 'meteor/npdev:collections'
import { Pages } from '../collections/pages'

export const usePage = createConnector({
  name: 'page',
  collection: Pages,
  validate ({ slug }) {
    check(slug, String)
  },
  query ({ slug }) {
    return { slug }
  }
})
