import { createServer } from "@graphql-yoga/common";
import { gatewaySchema } from "./Schema/SchemaIndex";


export interface Env {
  TODOS: KVNamespace;
  TEACHER: KVNamespace;
  SCHOOL: KVNamespace;
  PUPIL: KVNamespace;
}

const server = createServer<{ cf: { env: Env } }>({
  schema : gatewaySchema  
});

const fetch = async (req: Request, env: Env, ctx: ExecutionContext) =>
  await server.handleRequest(req, { cf: { env } });

export default {
  fetch,
};
