import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext =
  createContext(null);

// =====================================================
// STORAGE KEYS
// =====================================================

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const ROLE_KEY = "role";

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ===================================================
  // LOAD CURRENT BROWSER SESSION
  // ===================================================

  useEffect(() => {
    try {
      const savedToken =
        sessionStorage.getItem(
          TOKEN_KEY
        );

      const savedUser =
        sessionStorage.getItem(
          USER_KEY
        );

      const savedRole =
        sessionStorage.getItem(
          ROLE_KEY
        );

      console.log(
        "AUTH SESSION CHECK"
      );

      console.log(
        "Token exists:",
        !!savedToken
      );

      console.log(
        "User exists:",
        !!savedUser
      );

      if (
        savedToken &&
        savedUser
      ) {
        try {
          const parsedUser =
            JSON.parse(savedUser);

          setToken(savedToken);
          setUser(parsedUser);

          /*
           * Keep role consistent.
           */
          if (
            parsedUser?.role &&
            !savedRole
          ) {
            sessionStorage.setItem(
              ROLE_KEY,
              String(
                parsedUser.role
              ).toLowerCase()
            );
          }
        } catch (error) {
          console.error(
            "Invalid saved user:",
            error
          );

          clearAuthStorage();

          setToken(null);
          setUser(null);
        }
      } else {
        /*
         * No valid current session.
         */
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Auth initialization error:",
        error
      );

      clearAuthStorage();

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = (
    accessToken,
    userData
  ) => {
    console.log(
      "LOGIN SUCCESS"
    );

    console.log(
      "User:",
      userData
    );

    /*
     * IMPORTANT:
     *
     * Use SESSION STORAGE ONLY.
     *
     * NEVER localStorage for auth.
     */

    sessionStorage.setItem(
      TOKEN_KEY,
      accessToken
    );

    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify(
        userData
      )
    );

    if (userData?.role) {
      sessionStorage.setItem(
        ROLE_KEY,
        String(
          userData.role
        ).toLowerCase()
      );
    }

    setToken(
      accessToken
    );

    setUser(
      userData
    );
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {
    console.log(
      "LOGOUT"
    );

    clearAuthStorage();

    setToken(null);
    setUser(null);
  };

  // ===================================================
  // CLEAR AUTH STORAGE
  // ===================================================

  const clearAuthStorage =
    () => {
      sessionStorage.removeItem(
        TOKEN_KEY
      );

      sessionStorage.removeItem(
        USER_KEY
      );

      sessionStorage.removeItem(
        ROLE_KEY
      );

      /*
       * IMPORTANT:
       *
       * Remove old localStorage auth too.
       *
       * This fixes users who logged in
       * before this authentication change.
       */

      localStorage.removeItem(
        TOKEN_KEY
      );

      localStorage.removeItem(
        USER_KEY
      );

      localStorage.removeItem(
        ROLE_KEY
      );

      /*
       * Also remove possible old
       * authentication keys.
       */

      localStorage.removeItem(
        "token"
      );

      sessionStorage.removeItem(
        "token"
      );
    };

  // ===================================================
  // AUTH STATUS
  // ===================================================

  const isAuthenticated =
    Boolean(
      token && user
    );

  // ===================================================
  // ROLE
  // ===================================================

  const role = String(
    user?.role ||
      sessionStorage.getItem(
        ROLE_KEY
      ) ||
      ""
  )
    .toLowerCase()
    .trim();

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        loading,
        login,
        logout,
        clearAuth: clearAuthStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

export function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const {
    isAuthenticated,
    role,
    loading,
  } = useAuth();

  const location =
    useLocation();

  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="flex flex-col items-center gap-3">

          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

          <p className="text-sm font-bold text-slate-400">
            Checking session...
          </p>

        </div>

      </div>
    );
  }

  // ===================================================
  // NOT AUTHENTICATED
  // ===================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/home/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  // ===================================================
  // ROLE CHECK
  // ===================================================

  if (
    allowedRoles.length >
      0 &&
    !allowedRoles
      .map((item) =>
        String(item)
          .toLowerCase()
          .trim()
      )
      .includes(role)
  ) {
    const dashboardMap = {
      admin: "/admin/dashboard",
      business:
        "/business/dashboard",
      student:
        "/student/dashboard",
    };

    const correctDashboard =
      dashboardMap[role] ||
      "/home";

    return (
      <Navigate
        to={correctDashboard}
        replace
      />
    );
  }

  // ===================================================
  // AUTHENTICATED
  // ===================================================

  return children;
}