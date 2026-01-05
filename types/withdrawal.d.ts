export interface Business {
    id: string;
    user_id: string;
    business_name: string;
    business_size: string;
    timeline: string;
    logo_url: string;
    industry: string;
    working_hours: string | null;
    location: string;
    scope: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    country: string;
    state: string | null;
    country_code: string;
}

export interface RequestedBy {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    is_email_verified?: boolean; 
    created_at?: string;
    role?: {
        id: string;
        name: string;
        role_id: string;
    };
}

export interface Withdrawal {
    id: string;
    requested_user_id: string;
    business_id: string;
    amount: string;
    currency: string;
    status: string;
    notes: string | null;
    processed_by: string | null;
    processed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    business: Business;
    requested_by: RequestedBy;
}

export interface WithdrawalsResponse {
    statusCode: number;
    data: Withdrawal[];
    count: number;
}

export interface WithdrawalDetailsResponse {
    statusCode: number;
    data: Withdrawal;
}

export interface CreateWithdrawalResponse {
    statusCode: number;
    message: string;
    data: Withdrawal;
}
