export interface FirebasePayload {
    notification: {
        title: string;
        body: string;
    };
    data?: Record<string, any>;
}

export interface FirebaseState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface FirebaseState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface FirebaseTokenResponse {
    token: string;
    device_type: string;
    created_at: string;
    updated_at: string;
}
