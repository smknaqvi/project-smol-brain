declare namespace Express {
  export interface Request {
    username?: string | null;
    session: Session;
  }
}
