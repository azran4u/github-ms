export class Repo {
  constructor(
    private name: string,
    private id: string,
    private isPrivate: boolean,
    private url: string,
    private size: number,
  ) {
    this.name = name;
    this.id = id;
    this.isPrivate = isPrivate;
    this.url = url;
    this.size = size;
  }
}
