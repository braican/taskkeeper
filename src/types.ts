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
  hours?: number;
  price?: number;
}
