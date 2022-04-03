import logo from "./logo.svg";
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  HttpLink,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import TodoContainer from "./components/templates/TodoContainer";

//--------providing custom themes-------------
const theme = createTheme({});

// ------------graphql instance-----------
const httpLink = createHttpLink({
  uri: "https://todo-kloudmate.hasura.app/v1/graphql",
});
//---auth headers---------
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "content-type": "application/json",
      "x-hasura-admin-secret":
        "wUXfdRRIVC9a5sSbokV9BTIBogF2JyNTAXQ3heHoyAs5IEXpWKp37cWN7RVrAOsz",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App-container">
        <div className="Todo-container-parent">
          <ApolloProvider client={client}>
            <TodoContainer className="Todo-container-child"></TodoContainer>
          </ApolloProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
