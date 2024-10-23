import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";

const AddDocumentType = new GraphQLObjectType({
  name: "AddDocument",
  description: "All documents",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    creator: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default AddDocumentType;
