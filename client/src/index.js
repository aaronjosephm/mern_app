import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from './App';
import * as serviceWorker from './serviceWorker';

// The ApolloCLient needs a uri in order to create an instance.

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

// We need to wrap the instance of app with apollo in order to make graphQL queries within it.

// ApolloProvider needs to take in ApolloClient as a prop.

ReactDOM.render(
	<ApolloProvider client={client}>
	<App />
	</ApolloProvider>,
	 document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
