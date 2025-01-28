export interface Client {
  id: string;
  name: string;
  key: string;
  rate: number;
  address: string;
}

export interface Task {
  id: string;
  client: string;
  description: string;
  status: 'estimated' | 'approved' | 'done';
  isHourly: boolean;
  hours?: number | null;
  price?: number | null;
}

export interface InvoicedTask {
  id: string;
  description: string;
  isHourly: boolean;
  cost: number;
  hours?: number;
}

export interface Invoice {
  id: string;
  client: string;
  number: string;
  status: 'active' | 'paid';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description?: string;
  tasks: InvoicedTask[];
}
