import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const httpLink = createHttpLink({
  uri: '/graphql',
  // uri: location.href.includes('localhost') ? 'http://localhost:3001/graphql' : 'insert production server uri here',
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />

    </ApolloProvider>
  )


}

export default App;
