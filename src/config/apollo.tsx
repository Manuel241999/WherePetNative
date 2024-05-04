import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink: ApolloLink = createHttpLink({
  uri: 'https://wherepetapi-ea4c9315e9ed.herokuapp.com/',
});

const authLink: ApolloLink = setContext(async (_, { headers }): Promise<{ headers: Record<string, string> }> => {
  // Leer token
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
