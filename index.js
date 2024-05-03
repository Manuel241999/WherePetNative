/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { MapsApp } from './src/MapsApp';

//Apollo 
import client from './src/config/apollo';
import {ApolloProvider} from '@apollo/client'

const wherePetApp = () => (
    <ApolloProvider client={client}>
        <MapsApp />
    </ApolloProvider>
);


AppRegistry.registerComponent(appName, () => wherePetApp);
