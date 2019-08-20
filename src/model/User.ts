import { Repo } from './Repo';

export class User {
  constructor(
    private name: string,
    private id: string,
    private url: string,
    private repos: Repo[],
    private diskUsage: number,
  ) {
    this.name = name;
    this.id = id;
    this.url = url;
    this.repos = repos;
    this.diskUsage = diskUsage;
  }
  public setRepos(repos: Repo[]) {
    this.repos = repos;
  }
}
