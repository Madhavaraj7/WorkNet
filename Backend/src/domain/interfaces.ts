// src/domain/interfaces.ts

export interface IUser {
    _id: string;
    username: string;
  }
  
  export interface IWorker {
    _id: string;
    name: string;
    categories: ICategory[];
  }
  

  // src/domain/interfaces.ts

export interface ICategory {
    _id: string;
    name: string;
    // Add other optional fields if necessary
  }
  
  export interface IBooking {
    _id: string;
    userId: IUser;
    workerId: IWorker;
    createdAt: Date;
    amount: number;
    status: string;
  }
  