// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../services/supabase";

// type AuthContextType = {
//   user: any;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
// });

// export const AuthProvider = ({ children }: any) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // get current session
//     supabase.auth.getSession().then(({ data }) => {
//       setUser(data.session?.user || null);
//       setLoading(false);
//     });

//     // listen auth changes
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type UserType = {
  id: string;
  email: string;
  role: string;
};

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserWithRole = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setUser({
      id: data.user.id,
      email: data.user.email!,
      role: profile?.role || "user",
    });

    setLoading(false);
  };

  useEffect(() => {
    getUserWithRole();

    supabase.auth.onAuthStateChange(() => {
      getUserWithRole();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);