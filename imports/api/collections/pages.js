import { createCollection } from 'meteor/npdev:collections'
import { check } from 'meteor/check'
import SimpleSchema from 'simpl-schema'

export const PageSchema = new SimpleSchema({
  title: {
    type: String,
    trim: false
  },

  slug: {
    type: String
  },

  content: {
    type: String,
    trim: false
  }
}, { check })

export const Pages = createCollection('pages', PageSchema)
