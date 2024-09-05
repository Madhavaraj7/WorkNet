// src/types/zaopay.d.ts
interface ZaopayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    handler: (response: any) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
  }
  
  interface Zaopay {
    init: (options: ZaopayOptions) => { open: () => void };
  }
  
  interface Window {
    Zaopay: Zaopay;
  }
  