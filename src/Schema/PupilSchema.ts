import { v4 as uuidv4 } from 'uuid';
import { makeExecutableSchema } from '@graphql-tools/schema';

let  PupilSchema = makeExecutableSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        Pupils: PupilList
        GetPupil(name: ID!): Pupil
      }
      type Mutation {
        addPupil(value: String!): Pupil
        deletePupil(id: ID!): Boolean
      }
      type PupilList {
        results: [Pupil]
        cursor: String
      }
      type Pupil {
        name: String
        value: String
        expiration: Int
      }
    `,
    resolvers: {
      Query: {
        Pupils: async (_, __, { cf }) => {
          const { keys, cursor } = await cf.env.PUPIL.list({
            // limit: 1,
          });

          return {
            results: keys,
            cursor,
          };
        },
        GetPupil: async (_, { name }) => ({
          name,
        }),
      },
      Pupil: {
        value: async ({ name }: any, _, { cf }) =>
          await cf.env.PUPIL.get(name, "text"),
      },
      Mutation: {
        addPupil: async (_, { value }, { cf }) => {
          const name = uuidv4();
          await cf.env.PUPIL.put(name, value);

          return {
            name,
            value,
          };
        },
        deletePupil: async (_, { id }, { cf }) => {
          await cf.env.PUPIL.delete(id);
          return true;
        },
      },
    },
  })


  
  // setup subschema configurations
export const PupilSchemaSubschema = { schema: PupilSchema };
