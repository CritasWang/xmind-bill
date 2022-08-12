declare interface Bill {
  type: number;
  time: number;
  category: string;
  amount: number;
}

declare interface BillQO {
  type?: number | string;
  startTime?: number | string;
  endTime?: number | string;
  category?: string;
}

declare interface BillStatistics {
  incomeTotalAmount: number;
  payTotalAmount: number;
  incomeBills: Bill[];
  payBills: Bill[];
}
