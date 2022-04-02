import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TodoChild from "./TodoContainerChild";

function TodoContainer() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <TodoChild />
      </Container>
    </React.Fragment>
  );
}

export default TodoContainer;
