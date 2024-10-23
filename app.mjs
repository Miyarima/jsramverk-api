import express, { json } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { GraphQLSchema } from "graphql";
import socketServer from "./helpers/socket.mjs";
import index from "./routes/index.mjs";
import users from "./routes/users.mjs";
import RootQueryType from "./types/Root.mjs";
import RootMutationType from "./types/RootMutation.mjs";

const app = express();
const httpServer = createServer(app);

const port = process.env.PORT || 1337;

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

socketServer(httpServer);

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  next();
});

app.use("/docs", index);
app.use("/users", users);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get("/", async (req, res) => {
  let routes = {
    routes: {
      This: "/",
      "All documents": "/docs",
      "Create document": "/docs/create",
      "Update document": "/docs/update",
    },
  };
  res.json(routes);
});

app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    errors: [
      {
        status: err.status,
        title: err.message,
        detail: err.message,
      },
    ],
  });
});

httpServer.listen(port, () =>
  console.log(`Example API listening on port ${port}!`)
);
