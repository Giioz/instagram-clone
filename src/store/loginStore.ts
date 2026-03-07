import { create } from 'zustand';

interface LoginState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
  };
  isLoading: boolean;
}

interface LoginActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  validateEmail: () => boolean;
  validatePassword: () => boolean;
  validateForm: () => boolean;
  resetErrors: () => void;
  setLoading: (loading: boolean) => void;
}

type LoginStore = LoginState & LoginActions;

export const useLoginStore = create<LoginStore>((set, get) => ({
  email: '',
  password: '',
  errors: {},
  isLoading: false,
  setEmail: (email: string) => {
    set({ email });
  },

  setPassword: (password: string) => {
    set({ password });
  },

  validateEmail: () => {
    const { email } = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      set(state => ({
        errors: { ...state.errors, email: 'Email is required' }
      }));
      return false;
    }
    
    if (!emailRegex.test(email)) {
      set(state => ({
        errors: { ...state.errors, email: 'Please enter a valid email address' }
      }));
      return false;
    }
    
    set(state => ({
      errors: { ...state.errors, email: undefined }
    }));
    return true;
  },

  validatePassword: () => {
    const { password } = get();
    
    if (!password) {
      set(state => ({
        errors: { ...state.errors, password: 'Password is required' }
      }));
      return false;
    }
    
    if (password.length < 6) {
      set(state => ({
        errors: { ...state.errors, password: 'Password must be at least 6 characters' }
      }));
      return false;
    }
    
    set(state => ({
      errors: { ...state.errors, password: undefined }
    }));
    return true;
  },

  validateForm: () => {
    const isEmailValid = get().validateEmail();
    const isPasswordValid = get().validatePassword();
    return isEmailValid && isPasswordValid;
  },

  resetErrors: () => {
    set({ errors: {} });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
