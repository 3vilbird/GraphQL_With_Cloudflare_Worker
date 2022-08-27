import { v4 as uuidv4 } from 'uuid';
import { makeExecutableSchema } from '@graphql-tools/schema';

let  SchoolSchema = makeExecutableSchema({
  // query: Query!
    typeDefs: /* GraphQL */ `
      type Query {
        Schools: SchoolList
        GetSchool(name: ID!): School
      }

      type Mutation {
        
        addSchool(value: String!): School
        deleteSchool(id: ID!): Boolean
      }

      type SchoolList {
        results: [School]
        cursor: String
      }

      type School {
        name: String
        value: String
        expiration: Int
      }
    `,
    resolvers: {
      Query: {
        Schools: async (_, __, { cf }) => {
          const { keys, cursor } = await cf.env.SCHOOL.list({
            // limit: 1,
          });

          return {
            results: keys,
            cursor,
          };
        },
        GetSchool: async (_, { name }) => ({
          name,
        }),
      },
      School: {
        value: async ({ name }: any, _, { cf }) =>
          await cf.env.SCHOOL.get(name, "text"),
      },
      Mutation: {
        addSchool: async (_, { value }, { cf }) => {
          const name = uuidv4();
          await cf.env.SCHOOL.put(name, value);

          return {
            name,
            value,
          };
        },
        deleteSchool: async (_, { id }, { cf }) => {
          await cf.env.SCHOOL.delete(id);
          return true;
        },
      },
    },
  })


  
  // setup subschema configurations
export const SchoolSubschema = { schema: SchoolSchema };
