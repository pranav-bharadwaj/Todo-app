import { gql } from "@apollo/client";
import client from "../index";

export const get_todos = gql`
  {
    Todo_list {
      id
      title
      completed
      updatedtimes
    }
  }
`;

export const add_todo = gql`
  mutation addTodo($title: String!) {
    
    insert_Todo_list_one(object: {$title: String!}) {
        id
        title
      }
  }
`;
