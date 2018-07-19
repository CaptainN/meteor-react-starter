import { Meteor } from 'meteor/meteor'
import ApolloClient from 'apollo-client'
import { createApolloClient } from 'meteor/apollo'

const config = createApolloClient({
  ssrMode: Meteor.isServer,
  useMeteorAccounts: true
})
export const client = new ApolloClient(config)
