import { supabase } from "./supabase";

// SIGN UP
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

// LOGIN
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// LOGOUT
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// GET CURRENT USER
export const getUser = async () => {
  return await supabase.auth.getUser();
};