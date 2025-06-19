export const auth = (req: any, res: any, next: any) => {
  (req as any).user = { id: "mock-user-id" };
  next();
};
