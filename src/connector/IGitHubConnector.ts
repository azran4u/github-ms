import { User } from '../model/User';
import { GitHubCredentials } from '../config';

export interface IGitHubConnector {
  setCredentials(credentials: GitHubCredentials): void;
  fetchUser(): Promise<User>;
}
