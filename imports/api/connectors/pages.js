import { check } from 'meteor/check'
import { createListHook } from 'meteor/npdev:collections'
import { Pages } from '../collections/pages'

export const usePage = createListHook({
  name: 'page',
  collection: Pages,
  validate ({ slug }) {
    check(slug, String)
  },
  query ({ slug }) {
    return { slug }
  }
})
