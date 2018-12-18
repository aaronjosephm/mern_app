const { GraphQLServer } = require('graphql-yoga');

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test5", { useNewUrlParser: true } );

// First we create a new instance of the mongoose model (db model).
const Todo = mongoose.model('Todo', {
	text: String,
	complete: Boolean
});

// These typedefs need to be declared in order to make an instance of the graphQl server. 
// A new instance of the graphQL server takes in two parameters - 
// The typeDefs, and the resolvers which are described below.
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
  	id: ID!
  	text: String!
  	complete: Boolean!
  }
  type Mutation {
  	createTodo(text: String!): Todo
  	updateTodo(id: ID!, complete: Boolean!): Boolean
  	removeTodo(id: ID!): Boolean
  }
`
// resolvers are the actual methods that make changes on the database. All changes are made asynchronously using callback functions. 
const resolvers = {
  Query: {
  	// find() returns all database entries.
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
  	createTodo: async (_, { text }) => {
  		// save is a mongoose instance method.
  		const todo = new Todo({ text, complete: false});
  		await todo.save();
  		return todo;
  	},
  	updateTodo: async (_, { id, complete }) => {
  		// findByIdAndUpdate is a mongoose instance method.
  		await Todo.findByIdAndUpdate(id, { complete });
  		return true;
  	},
  	removeTodo: async (_, { id }) => {
  		// findByIdAndRemove is a mongoose instance method.
  		await Todo.findByIdAndRemove(id);
  		return true;
  	},
  }
};

// Need to make an instance of our GraphQl Server in our mongoose connection.

const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once('open', function() {
	server.start(() => console.log('Server is running on localhost:4000'));
});

// Export module mongoose.

module.exports = mongoose;
