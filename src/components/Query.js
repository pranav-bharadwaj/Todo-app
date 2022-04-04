import { gql } from "@apollo/client";
import client from "../index";

export const get_todos = gql`
  {
    Todo_list(order_by: { id: desc }) {
      id
      title
      completed
      updatedtimes
    }
  }
`;

export const add_todo = gql`
  mutation ($title: String!) {
    insert_Todo_list_one(object: { title: $title }) {
      id
      title
      completed
      updatedtimes
    }
  }
`;
export const toggle_complete = gql`
  mutation ($id: Int!, $completed: Boolean!) {
    update_Todo_list_by_pk(
      pk_columns: { id: $id }
      _set: { completed: $completed }
    ) {
      id
    }
  }
`;
export const update_title = gql`
  mutation ($id: Int!, $title: String!) {
    update_Todo_list_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const delete_todo = gql`
  mutation ($id: Int!) {
    delete_Todo_list_by_pk(id: $id) {
      id
    }
  }
`;

export const delete_completed = gql`
  mutation delete_Todo_list {
    delete_Todo_list(where: { completed: { _eq: true } }) {
      affected_rows
    }
  }
`;
