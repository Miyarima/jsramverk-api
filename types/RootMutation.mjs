import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import docs from "../helpers/documments.mjs";
import AddDocumentType from "./Adddocument.mjs";
import UpdateDocumentType from "./Updatedocument.mjs";

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addDocument: {
      type: AddDocumentType,
      description: "Add a document",
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        creator: { type: new GraphQLNonNull(GraphQLString) },
        code: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        docs.addDoc(args.title, args.content, args.creator, args.code);
        return {
          title: args.title,
          content: args.content,
          creator: args.creator,
          code: args.code,
        };
      },
    },
    updateDocument: {
      type: UpdateDocumentType,
      description: "update a document",
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        docs.updateDoc(args.id, args.title, args.content);
        return { id: args.id, title: args.title, content: args.content };
      },
    },
  }),
});

export default RootMutationType;
