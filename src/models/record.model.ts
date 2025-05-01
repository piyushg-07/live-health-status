export type Status = 'Healthy' | 'Sick' | 'Critical';

export interface Record {
  id: string;
  name: string;
  age: number;
  status: Status;
  last_updated: Date;
}
