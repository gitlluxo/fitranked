import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sgrhzwdlquodmgjosswc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncmh6d2RscXVvZG1nam9zc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjg5MDgsImV4cCI6MjA1OTc0NDkwOH0.hG2vkjcuVnXl7w3O-qcwmvVH4zqVVcvTbIqqoomgexU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
