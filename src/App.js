import logo from "./logo.svg";
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import TodoContainer from "./components/templates/TodoContainer";

//--------providing custom themes-------------
const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App-container">
        <div className="Todo-container-parent">
          <TodoContainer className="Todo-container-child"></TodoContainer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
