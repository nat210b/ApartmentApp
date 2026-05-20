import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};

export type ResetPasswordInput = {
  email: string;
  redirectTo?: string;
};

export const signIn = async ({ email, password }: SignInInput): Promise<Session> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error("Unable to create auth session.");
  }

  return data.session;
};

export const signUp = async ({ email, password }: SignUpInput): Promise<User | null> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
};

export const resetPassword = async ({
  email,
  redirectTo,
}: ResetPasswordInput): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
};

export const updatePassword = async (password: string): Promise<User> => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
};

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) => {
  return supabase.auth.onAuthStateChange(callback);
};
