const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { users, events, locations, participants } = require('./data.json');


const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    user: User!
    location: Location!
    participants: [Participant!]
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    events: [Event!]
  }

  type Participant {
    id: ID!
    user: User!
    event: Event!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    events: [Event!]!
    event(id: ID!): Event
    locations: [Location!]!
    location(id: ID!): Location
    participants: [Participant!]!
    participant(id: ID!): Participant
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(user => user.id.toString() === args.id),
    events: () => events,
    event: (parent, args) => events.find(event => event.id.toString() === args.id),
    locations: () => locations,
    location: (parent, args) => locations.find(loc => loc.id.toString() === args.id),
    participants: () => participants,
    participant: (parent, args) => participants.find(p => p.id.toString() === args.id),
  },

  User: {
    events: (parent) => events.filter(event => event.user_id === parent.id),
  },

  Event: {
    user: (parent) => users.find(user => user.id === parent.user_id),
    location: (parent) => locations.find(loc => loc.id === parent.location_id),
    participants: (parent) => participants.filter(p => p.event_id === parent.id),
  },

  Location: {
    events: (parent) => events.filter(event => event.location_id === parent.id),
  },

  Participant: {
    user: (parent) => users.find(user => user.id === parent.user_id),
    event: (parent) => events.find(event => event.id === parent.event_id),
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => console.log(`🚀 Apollo server is running at ${url}`));
