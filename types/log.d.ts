export interface UserRole {
  id: string;
  role_id: string;
}

export interface User {
  role: UserRole;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: 'CONTACT_INVITATION'; // Restricting to specific action
  entity: 'BusinessContact'; // Restricting to specific entity
  entity_id: string;
  metadata: string;
  ip_address: string;
  user_agent: string;
  created_at: string; // Keeping ISO date format as string
  updated_at: string;
  deleted_at: string | null;
  user: User;
}

export type LogsResponse = {
  statusCode: number;
  data: ActivityLog[];
  count: number;
};
