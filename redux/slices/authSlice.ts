import api from '@/lib/api';
import {
  KYCProps,
  LoginProps,
  RegisterFormProps,
  RequestPasswordCreationProps,
  RequestPasswordResetProps,
  ResendEmailProps,
  ResetPasswordProps,
  SavePasswordByTokenProps,
  TokenProps,
  UpdatePasswordProps,
  UserProfileProps,
  VerifyEmailFormProps,
  VerifyPasswordTokenProps,
} from '@/lib/schema/auth.schema';
import { GenericResponse } from '@/types';
import {
  Profile,
  ProfileResponse,
  RegisterResponse,
  VerifyEmailByTokenResponse,
  VerifyEmailResponse,
} from '@/types/account';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  profile: Profile | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: Cookies.get('token') || null,
  loading: false,
  error: null,
};

// Async Thunk to register
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterFormProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post<RegisterResponse>(
        '/auth/register',
        credentials
      );

      return {
        message: data.message,
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// Async Thunk to verify email
export const verifyEmail = createAsyncThunk(
  'auth/verify-email',
  async (credentials: VerifyEmailFormProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post<VerifyEmailResponse>(
        '/auth/verify-email',
        credentials
      );

      if (data?.accessToken) {
        Cookies.set('token', data?.accessToken, { expires: 3 });
      }

      return {
        message: data.message,
        token: data?.accessToken,
        data: data?.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Email verification failed'
      );
    }
  }
);

// Async Thunk to resend email
export const resendEmail = createAsyncThunk(
  'auth/resend-email',
  async (credentials: ResendEmailProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/resend-email', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Email resending failed');
    }
  }
);

// Async Thunk for login
export const login = createAsyncThunk(
  'auth/request-account-otp',
  async (credentials: LoginProps, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/request-account-otp', credentials);
      const { user, token, data, message } = response.data;
      return { user, token, data, message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async Thunk for verify login
export const verifyLogin = createAsyncThunk(
  'auth/verify-account-otp',
  async (credentials: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-account-otp', credentials);
      const { accessToken: token, message, data } = response.data;
      Cookies.set('token', token, { expires: 3 });
      return { token, message, data };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'OTP verification failed');
    }
  }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  'auth/google-login',
  async (
    credentials: {
      token: string;
      provider: 'GOOGLE';
      role?: string;
      action_type: 'SIGNIN' | 'SIGNUP';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/sso', credentials);
      const { accessToken: token, message, data } = response.data;

      Cookies.set('token', token, { expires: 3 });

      return { token, message, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Google login failed');
    }
  }
);

// Async Thunk for password reset request
export const requestPasswordReset = createAsyncThunk(
  'auth/request-password-reset',
  async (credentials: RequestPasswordResetProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/auth/request-password-reset',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Password reset request failed'
      );
    }
  }
);

// Async thunk for set password by token
export const setPasswordByToken = createAsyncThunk(
  'auth/verify-email-save-password',
  async (credentials: SavePasswordByTokenProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/auth/verify-email-save-password',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Verify email save password failed'
      );
    }
  }
);

// Async thunk to verify email token
export const verifyPasswordToken = createAsyncThunk(
  'auth/verify-password-token',
  async (credentials: VerifyPasswordTokenProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/auth/verify-password-token',
        credentials
      );
      const { message, data } = response.data;
      return { message, data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Password token verification failed'
      );
    }
  }
);

// Async thunk to verify email token
export const verifyEmailToken = createAsyncThunk(
  'auth/verify-email-token',
  async (credentials: TokenProps, { rejectWithValue }) => {
    try {
      const response = await api.post<VerifyEmailByTokenResponse>(
        '/auth/verify-email-token',
        credentials
      );
      const { message, data } = response.data;
      return { message, data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Email token verification failed'
      );
    }
  }
);

// Async thunk to request password creation link
export const requestPasswordCreation = createAsyncThunk(
  'auth/request-password-creation',
  async (credentials: RequestPasswordCreationProps, { rejectWithValue }) => {
    try {
      const response = await api.post<GenericResponse>(
        '/auth/request-password-creation',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Password creation request failed'
      );
    }
  }
);

// Async Thunk to reset password
export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (credentials: ResetPasswordProps, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', credentials);
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Password reset failed');
    }
  }
);

// Async Thunk to save profile information
export const saveProfile = createAsyncThunk(
  'auth/save-profile-info',
  async (credentials: UserProfileProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/save-profile-info', credentials);

      return {
        message: data.message,
        profile: data.data,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to save profile info'
      );
    }
  }
);

// Async Thunk to save KYC information
export const submitKYC = createAsyncThunk(
  'onboard/kyc',
  async (
    { kycData, businessId }: { kycData: KYCProps; businessId: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/onboard/kyc',
        kycData,
        {
          headers: {
            'Business-Id': businessId,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit KYC');
    }
  }
);

// Async Thunk to view profile information
export const viewProfile = createAsyncThunk('auth/view-profile', async () => {
  try {
    const { data } = await api.get<ProfileResponse>('/auth/view-profile');

    return {
      profile: data.data,
    };
  } catch (error: any) {
    console.log(error);
  }
});

// Async Thunk to update password information
export const updatePassword = createAsyncThunk(
  'auth/update-password',
  async (credentials: UpdatePasswordProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/update-password', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to update password'
      );
    }
  }
);

// Async Thunk to delete account
export const deleteAccount = createAsyncThunk(
  'auth/delete-account',
  async ({}, { rejectWithValue }) => {
    try {
      const { data } = await api.delete('/auth/delete-account');

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to delete account'
      );
    }
  }
);

// Async Thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  Cookies.remove('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.token = action.payload?.token;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resendEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPasswordToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordToken.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyPasswordToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(viewProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.profile!;
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setPasswordByToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(setPasswordByToken.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setPasswordByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitKYC.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitKYC.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(submitKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
