import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import docs from "../helpers/documments.mjs";
import DocumentType from "./documents.mjs";

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    document: {
      type: DocumentType,
      description: "A single document",
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => docs.getDoc(args.id),
    },
    documents: {
      type: new GraphQLList(DocumentType),
      description: "A list of all documents",
      args: {
        creator: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => docs.getDocs(args.creator),
    },
  }),
});

export default RootQueryType;
