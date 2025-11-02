import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface EditorContextType {
  isEditorMode: boolean;
  hasEditorRole: boolean;
  session: Session | null;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoadingRole: boolean;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [hasEditorRole, setHasEditorRole] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(true); // Start as true to check on mount

  // Check if user has editor or admin role
  const checkEditorRole = async (userId: string) => {
    setIsLoadingRole(true);
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'editor'
      });
      
      if (error) {
        console.error('Error checking editor role:', error);
        setIsLoadingRole(false);
        return false;
      }
      
      // Also check for admin role
      const { data: adminData, error: adminError } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (adminError) {
        console.error('Error checking admin role:', adminError);
        setIsLoadingRole(false);
        return false;
      }
      
      setIsLoadingRole(false);
      return data === true || adminData === true;
    } catch (err) {
      console.error('Error in checkEditorRole:', err);
      setIsLoadingRole(false);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        // Check role when session changes
        if (session?.user) {
          setTimeout(() => {
            checkEditorRole(session.user.id).then((hasRole) => {
              console.log('Editor role check result:', hasRole);
              setHasEditorRole(hasRole);
            });
          }, 0);
          setShowLoginDialog(false);
        } else {
          setHasEditorRole(false);
          setIsLoadingRole(false);
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        checkEditorRole(session.user.id).then((hasRole) => {
          console.log('Initial editor role check result:', hasRole);
          setHasEditorRole(hasRole);
        });
      } else {
        setIsLoadingRole(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+E to enter editor mode
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (!session) {
          setShowLoginDialog(true);
        }
      }
      // Ctrl+Shift+L to exit editor mode
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        signOut();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [session]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <EditorContext.Provider
      value={{
        isEditorMode: !!session && hasEditorRole,
        hasEditorRole,
        session,
        showLoginDialog,
        setShowLoginDialog,
        signIn,
        signOut,
        isLoadingRole,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};
