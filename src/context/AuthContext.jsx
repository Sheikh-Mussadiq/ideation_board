import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchSocialHubDataAndCallBackend } from "../services/socialhubAuth";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { getUserEmailNotification } from "../services/userService";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [currentUserUsers, setCurrentUserUsers] = useState([]);
  const [currentUserTeams, setCurrentUserTeams] = useState([]);
  const [currentUserChannels, setCurrentUserChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDataAndToken = async () => {
    const jwtResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/userDataSocialHub`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      }
    );

    if (jwtResponse.ok) {
      const apiResponse = await jwtResponse.json();
      console.log("from jwt and all data development: ", apiResponse);

      const token = apiResponse.token;
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      // Set Supabase authenticated user from API response.
      const userData = await supabase.auth.getUser();
      setAuthUser(userData.data.user);

      // Set Supabase authenticated user from API response. Not working for now
      // const userData = apiResponse.userInfo.sbUser;
      // setAuthUser(userData);

      const emailPreferance = await getUserEmailNotification(
        userData.data.user.id
      );
      setCurrentUser({
        ...apiResponse.userInfo,
        userName: `${apiResponse.userInfo.firstName}_${apiResponse.userInfo.lastName}`,
        email_preferance: emailPreferance,
      });

      setCurrentUserTeams(apiResponse.userTeams);

      const updatedUsers = apiResponse.userUsers.map((user) => {
        const firstNameClean = user.firstName.replace(/\s+/g, "");
        const lastNameClean = user.lastName.replace(/\s+/g, "");
        return {
          ...user,
          userName: `${firstNameClean}_${lastNameClean}`,
        };
      });
      console.log("after updating users: ", updatedUsers);
      setCurrentUserUsers(updatedUsers);
      setCurrentUserChannels(apiResponse.userChannels);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      console.error("Failed to generate JWT");
      setIsLoading(false);
    }
  };

  const getToken = async () => {
    try {
      const apiResponse = await fetchSocialHubDataAndCallBackend();
      console.log("from jwt and all data production: ", apiResponse);

      // await supabase.auth.setSession({
      //   // access_token: token,
      //   // refresh_token: token,
      // });

      // Set Supabase authenticated user from API response.
      // const userData = await supabase.auth.getUser();
      // setAuthUser(userData.data.user);

      //Set Supabase authenticated user from API response.
      // await supabase.auth.setSession({
      //   // access_token: token,
      //   // refresh_token: token,
      // });

      // Set Supabase authenticated user from API response.
      // const userData = await supabase.auth.getUser();
      // setAuthUser(userData.data.user);

      //Set Supabase authenticated user from API response.
      const userData = apiResponse.userInfo.sbUser;
      setAuthUser(userData);

      const emailPreferance = await getUserEmailNotification(userData.id);
      setCurrentUser({
        ...apiResponse.userInfo,
        email_preferance: emailPreferance,
      });

      setCurrentUserTeams(apiResponse.userTeams);

      const updatedUsers = apiResponse.userUsers.map((user) => {
        const firstNameClean = user.firstName.replace(/\s+/g, "");
        const lastNameClean = user.lastName.replace(/\s+/g, "");
        return {
          ...user,
          userName: `${firstNameClean}_${lastNameClean}`,
        };
      });

      console.log("after updating users: ", updatedUsers);
      setCurrentUserUsers(updatedUsers);
      setCurrentUserChannels(apiResponse.userChannels);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (import.meta.env.VITE_ENVIORNMENT === "development") {
      console.log("from development");
      getDataAndToken();
    } else {
      console.log("from production");
      getToken();
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const loginResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/loginSocialHub`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const LoginResponse = await loginResponse.json();
      console.log("from social hub login: ", LoginResponse);

      if (!LoginResponse.success) {
        // Handle non-200 responses
        throw new Error("Login failed");
      }

      if (import.meta.env.VITE_ENVIORNMENT === "development") {
        console.log("from development");
        await getDataAndToken();
      } else {
        console.log("from production");
        await getToken();
      }

      return LoginResponse.success;
    } catch (error) {
      toast.error("Login failed");
      console.error("SocialHub login error:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        isLoading,
        authUser,
        currentUserUsers,
        currentUserTeams,
        currentUserChannels,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
