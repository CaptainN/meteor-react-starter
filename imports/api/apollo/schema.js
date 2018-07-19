import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

export const typeDefs = gql`
type Query {
  say: String!
}
`

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
