export interface Item {
  id: string;
  file_name: string;
  email: string;
  tag?: string;
  created_at: Date;
  link?: string;
  expired_at?: Date;
}
