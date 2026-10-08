import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '../types';
import { 
  supabase, 
  isSupabaseConfigured, 
  demoProfiles, 
  getProfileById, 
  updateProfileRecord,
  LOCAL_DEMO_AUTH_KEY 
} from '../lib/supabase';
import { getUserCustomPassword, setUserPassword, updateUserAccount } from '../lib/dataService';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session & listen to auth changes
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured) {
          // 1. Live Supabase Session check
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user && isMounted) {
            setUser(session.user);
            const userProfile = await getProfileById(session.user.id);
            if (userProfile && isMounted) {
              setProfile(userProfile);
              setRole(userProfile.role);
            }
          }
        } else {
          // 2. Local Demo Storage check
          const savedDemoProfile = localStorage.getItem(LOCAL_DEMO_AUTH_KEY);
          if (savedDemoProfile && isMounted) {
            try {
              const parsed: Profile = JSON.parse(savedDemoProfile);
              setProfile(parsed);
              setRole(parsed.role);
              // Create a lightweight mock User representation
              setUser({
                id: parsed.id,
                email: parsed.email,
                app_metadata: {},
                user_metadata: { full_name: parsed.full_name, role: parsed.role },
                aud: 'authenticated',
                created_at: parsed.created_at || new Date().toISOString(),
              } as User);
            } catch (e) {
              localStorage.removeItem(LOCAL_DEMO_AUTH_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    // Set up auth state change listener if Supabase is active
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser(session.user);
          const userProfile = await getProfileById(session.user.id);
          if (userProfile && isMounted) {
            setProfile(userProfile);
            setRole(userProfile.role);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Log in user using email and password
   */
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          setUser(data.user);
          const userProfile = await getProfileById(data.user.id);
          if (!userProfile) {
            // If profile does not exist yet, fallback to role from metadata or default
            const fallbackRole = (data.user.user_metadata?.role as UserRole) || 'student';
            const newProfile: Profile = {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || 'Academy Scholar',
              email: data.user.email || email,
              role: fallbackRole,
              is_active: true,
            };
            setProfile(newProfile);
            setRole(fallbackRole);
          } else {
            setProfile(userProfile);
            setRole(userProfile.role);
          }
        }
      } else {
        // Standalone/Demo mode login handler
        const lowerEmail = email.trim().toLowerCase();
        
        // Find matching profile by email from demoProfiles or localStorage ga_users
        let matchedDemo = demoProfiles[lowerEmail];
        if (!matchedDemo) {
          try {
            const storedUsersStr = localStorage.getItem('ga_users');
            if (storedUsersStr) {
              const storedUsers: Profile[] = JSON.parse(storedUsersStr);
              const found = storedUsers.find(u => u.email.toLowerCase() === lowerEmail);
              if (found) matchedDemo = found;
            }
          } catch {}
        }

        if (!matchedDemo) {
          throw new Error('No account found with this email address. Please check your credentials or contact the registrar.');
        }

        // Strict Password Verification
        if (!password || password.trim().length === 0) {
          throw new Error('Please enter your password.');
        }

        // Check for customized password first
        const customPassword = getUserCustomPassword(lowerEmail);
        if (customPassword) {
          if (password !== customPassword) {
            throw new Error('Invalid credentials: password does not match.');
          }
        } else {
          // Fallback to role-specific password
          if (matchedDemo.role === 'admin') {
            const storedAdminPass = localStorage.getItem('ga_admin_secret_pass') || 'admin123';
            if (password !== storedAdminPass) {
              throw new Error('Invalid Administrator password. Access restricted to authorized personnel only.');
            }
          } else if (matchedDemo.role === 'teacher') {
            const storedTeacherPass = localStorage.getItem('ga_teacher_secret_pass') || 'teacher123';
            if (password !== storedTeacherPass) {
              throw new Error('Invalid Teacher credentials. Please verify your password.');
            }
          } else if (matchedDemo.role === 'parent') {
            const storedParentPass = localStorage.getItem('ga_parent_secret_pass') || 'parent123';
            if (password !== storedParentPass) {
              throw new Error('Invalid Parent credentials. Please verify your password.');
            }
          } else if (matchedDemo.role === 'student') {
            const storedStudentPass = localStorage.getItem('ga_student_secret_pass') || 'student123';
            if (password !== storedStudentPass) {
              throw new Error('Invalid Student credentials. Please verify your password.');
            }
          }
        }

        // Simulate network delay
        await new Promise((res) => setTimeout(res, 300));

        localStorage.setItem(LOCAL_DEMO_AUTH_KEY, JSON.stringify(matchedDemo));
        setProfile(matchedDemo);
        setRole(matchedDemo.role);
        setUser({
          id: matchedDemo.id,
          email: matchedDemo.email,
          app_metadata: {},
          user_metadata: { full_name: matchedDemo.full_name, role: matchedDemo.role },
          aud: 'authenticated',
          created_at: matchedDemo.created_at || new Date().toISOString(),
        } as User);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user and clear state
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(LOCAL_DEMO_AUTH_KEY);
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update current user's profile (name, phone, photo, etc.)
   */
  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    if (!profile) throw new Error('No profile to update');
    const updated = await updateProfileRecord(profile.id, updates);
    setProfile(updated);
    if (updated.role) setRole(updated.role);
    if (user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: updated.full_name,
        }
      });
    }
    // Also sync in ga_users and demoProfiles
    await updateUserAccount(profile.id, updates);
  };

  /**
   * Change / update password for current user
   */
  const updatePassword = async (newPassword: string): Promise<void> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
    }
    
    // Save per-user custom password
    if (profile?.email) {
      await setUserPassword(profile.email, newPassword);
    }

    if (role === 'admin') {
      localStorage.setItem('ga_admin_secret_pass', newPassword);
    } else if (role === 'teacher') {
      localStorage.setItem('ga_teacher_secret_pass', newPassword);
    } else if (role === 'parent') {
      localStorage.setItem('ga_parent_secret_pass', newPassword);
    } else if (role === 'student') {
      localStorage.setItem('ga_student_secret_pass', newPassword);
    }
    await new Promise(r => setTimeout(r, 350));
  };

  /**
   * Request password reset email
   */
  const resetPasswordForEmail = async (email: string): Promise<void> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new Error(error.message);
    } else {
      // Demo simulated success
      await new Promise(r => setTimeout(r, 400));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        login,
        logout,
        updateProfile,
        updatePassword,
        resetPasswordForEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
