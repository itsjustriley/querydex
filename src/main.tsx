import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom'

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://graphqlpokemon.favware.tech/v8'
});

export const client = new ApolloClient({
  cache: cache,
  link: link,

  name: 'graphql-pokemon-client',
  version: '1.0',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
