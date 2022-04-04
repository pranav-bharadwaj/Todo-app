import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TodoChild from "./TodoContainerChild";
import { useQuery } from "@apollo/client";
import { get_todos } from "../Query";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
function TodoContainer() {
  const { loading, error, data } = useQuery(get_todos, { pollInterval: 4000 });
  console.log(error);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        {loading ? (
          <Loading childs={data} />
        ) : error ? (
          <h1>Something went wrong...!</h1>
        ) : (
          <TodoChild Todos={data.Todo_list} />
        )}
      </Container>
    </React.Fragment>
  );
}
function Loading({ childs }) {
  console.log(childs);
  return (
    <div class="showbox">
      <div class="loader">
        <svg class="circular" viewBox="25 25 50 50">
          <circle
            class="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke-width="2"
            stroke-miterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
}

export default TodoContainer;
