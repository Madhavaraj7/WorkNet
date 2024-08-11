export const errorHandler = (status: number, message: string) => {
    const error = new Error(message);
    (error as any).status = status;
    return error;
  };
  