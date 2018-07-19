import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools'

import { typeDefs } from '/imports/api/apollo/schema'
import { resolvers } from '/imports/api/apollo/resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

createApolloServer({
  schema
})
