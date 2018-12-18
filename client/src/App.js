import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import gql from "graphql-tag";
import { graphql, compose } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Form from './form';

// All of these query methods are actually being called on the apollo client. Apollo client is being passed as a prop to this child.

// This makes this query available
const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;
// This makes this mutation available
const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;
// This makes this mutation available
const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;
// This makes this mutation available
const CreateMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

class App extends Component {
  // This is an asynchronous function that makes changes to the dom then updates the database.
  // The await expression causes an async function execution to pause until a Promise is resolved.
  // Once the promise is resolved, or rejected in some cases, the async function can then resume.
  // If the Promise is rejected then the await expression throws the rejected value.
  updateTodo = async todo => {
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        const data = store.readQuery({ query: TodosQuery });

        data.todos = data.todos.map(
          x => 
            x.id === todo.id 
            ? {
              ...todo,
              complete: !todo.complete
              }
            : x
        );
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  //  This is an asynchronous function that makes changes to the dom then updates the database.
  createTodo = async text => {
    await this.props.createTodo({
      variables: {
        text
      },
      update: (store, { data: { createTodo } }) => {

        const data = store.readQuery({ query: TodosQuery });

        data.todos.unshift(createTodo);

        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  //  This is an asynchronous function that makes changes to the dom then updates the database.
  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id,
      },
      update: store => {
        const data = store.readQuery({ query: TodosQuery });

        data.todos = data.todos.filter(x => x.id !== todo.id)
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  render() {
    const {data: {loading, todos}} = this.props;
    if (loading) {
      return null;
    }

    return (
      <div>
        <div style={{ margin: "auto", width: 400 }}>
          <Paper elevation={1}>
          <Form submit={this.createTodo} />
            <List>
              {todos.map(todo => (
                <ListItem 
                key={todo.id} 
                role={undefined} 
                dense 
                button 
                onClick={() => this.updateTodo(todo)}>
                  <Checkbox
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CreateMutation, { name: "createTodo" }),
  graphql(RemoveMutation, { name: "removeTodo" }),
  graphql(UpdateMutation, { name: "updateTodo" }),
  graphql(TodosQuery)
)(App);


