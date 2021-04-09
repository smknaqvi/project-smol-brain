export default class ErrorWithData extends Error {
  data: { type?: string };
  constructor(message: string) {
    super(message);
    this.data = {};
  }
}
