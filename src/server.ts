import { RestApi } from './api/rest';
import { GraphqlApi } from './api/graphql';

// console.log(graphqlServer);
new RestApi().init();
const a = new GraphqlApi();
