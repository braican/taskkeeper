export interface Client {
  id?: string;
  name: string;
  key: string;
  rate: number;
  address?: string;
}

export interface Task {
  id?: string;
  client: string;
  description: string;
  status?: string;
  hours?: number;
  price?: number;
}
