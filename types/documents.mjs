import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";

const DocumentType = new GraphQLObjectType({
  name: "Document",
  description: "All documents",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    creator: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: GraphQLString },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default DocumentType;
