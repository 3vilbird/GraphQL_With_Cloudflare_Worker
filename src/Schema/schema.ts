import { v4 as uuidv4 } from 'uuid';
import { makeExecutableSchema } from '@graphql-tools/schema';

let  Todos = makeExecutableSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        todos: TodoList
        todo(name: ID!): TodoItem
      }

      type Mutation {
        addTodo(value: String!): TodoItem
        deleteTodo(id: ID!): Boolean
      }

      type TodoList {
        results: [TodoItem]
        cursor: String
      }

      type TodoItem {
        name: String
        value: String
        expiration: Int
      }
    `,
    resolvers: {
      Query: {
        todos: async (_, __, { cf }) => {
          const { keys, cursor } = await cf.env.TODOS.list({
            // limit: 1,
          });

          return {
            results: keys,
            cursor,
          };
        },
        todo: async (_, { name }) => ({
          name,
        }),
      },
      TodoItem: {
        value: async ({ name }: any, _, { cf }) =>
          await cf.env.TODOS.get(name, "text"),
      },
      Mutation: {
        addTodo: async (_, { value }, { cf }) => {
          const name = uuidv4();
          //const name = "122334"

          await cf.env.TODOS.put(name, value);

          return {
            name,
            value,
          };
        },
        deleteTodo: async (_, { id }, { cf }) => {
          await cf.env.TODOS.delete(id);

          return true;
        },
      },
    },
  })


  // setup subschema configurations
export const todoSubschema = { schema: Todos };

