import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TodoChild from "./TodoContainerChild";
import { useQuery } from "@apollo/client";
import { get_todos } from "../Query";
function TodoContainer() {
  const { loading, error, data } = useQuery(get_todos);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        {loading ? (
          <h1>loading</h1>
        ) : error ? (
          <h1>error</h1>
        ) : (
          <TodoChild Todos={data.Todo_list} />
        )}
      </Container>
    </React.Fragment>
  );
}

export default TodoContainer;
