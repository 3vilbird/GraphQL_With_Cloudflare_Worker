import { v4 as uuidv4 } from 'uuid';
import { makeExecutableSchema } from '@graphql-tools/schema';

let  TeacherSchema = makeExecutableSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        Teachers: TeacherList
        GetTeacher(name: ID!): Teacher
      }

      type Mutation {
        addTeacher(value: String!): Teacher
        deleteTeacher(id: ID!): Boolean
        GetTeacher(name: ID!): Teacher
      }

      type TeacherList {
        results: [Teacher]
        cursor: String
      }

      type Teacher {
        name: String
        value: String
        expiration: Int
      }
    `,
    resolvers: {
      Query: {
        Teachers: async (_, __, { cf }) => {
          const { keys, cursor } = await cf.env.TEACHER.list({
            // limit: 1,
          });

          return {
            results: keys,
            cursor,
          };
        },
        GetTeacher: async (_, { name }) => ({
          name,
        }),
      },
      Teacher: {
        value: async ({ name }: any, _, { cf }) =>
          await cf.env.TEACHER.get(name, "text"),
      },
      Mutation: {
        addTeacher: async (_, { value }, { cf }) => {
          const name = uuidv4();
          await cf.env.TEACHER.put(name, value);

          return {
            name,
            value,
          };
        },
        deleteTeacher: async (_, { id }, { cf }) => {
          await cf.env.TEACHER.delete(id);
          return true;
        },
        GetTeacher: async (_, { name }) => ({
          name,
        }),
      },
    },
  })


  
  // setup subschema configurations
export const TeacherSubschema = { schema: TeacherSchema };
