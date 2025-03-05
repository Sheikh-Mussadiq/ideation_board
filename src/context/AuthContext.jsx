import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginToSocialHub } from "../services/socialhubAuth";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [currentUserUsers, setCurrentUserUsers] = useState([
    {
      _id: "5cc1b08ad62ec72e8388cb47",
      userName: "JohnDoe",
      firstName: "John",
      lastName: "Doe",
      
    },
    {
      _id: "5cc1b08ad62ec72e8388cb48",
      userName: "AliceSmith",
      firstName: "Alice",
      lastName: "Smith",
    },
    {
      _id: "5cc1b08ad62ec72e8388cb49",
      userName: "BobJohnson",
      firstName: "Bob",
      lastName: "Johnson",
      
  
    },
    {
      _id: "5cc1b08ad62ec72e8378dd3",
      userName: "MussadiqMehmood",
      firstName: "Mussadiq",
      lastName: "Mehmood",

    },
    {
      _id: "5cc1b08ad62ec72e8388cb4",
      userName: "MukarramNawaz",
      firstName: "Mukarram",
      lastName: "Nawaz",
    },
  ]);
  const [currentUserTeams, setCurrentUserTeams] = useState([
    {
      _id: "5cc1b08ad62ec72e8388cb50",
      name: "Solo Admin Team",
      users: ["5cc1b08ad62ec72e8388cb47"],
      channels: ["5cc1b08ad62ec72e8388cb51"],
      createdTime: "2022-02-10T12:00:00.000Z",
    },
    {
      _id: "5cc1b08ad62ec72e8388cb52",
      name: "Full Team",
      users: [
        "5cc1b08ad62ec72e8388cb47",
        "5cc1b08ad62ec72e8388cb48",
        "5cc1b08ad62ec72e8378dd3",
        "5cc1b08ad62ec72e8388cb4",
      ],
      channels: ["5cc1b08ad62ec72e8388cb53", "5cc1b08ad62ec72e8388cb54"],
      createdTime: "2023-06-15T08:30:00.000Z",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const cookies = localStorage.getItem("cookies");

    if (!localStorage.getItem("accessToken")) return;
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/userDataSocialHub",
        {
          method: "POST", // Change this to 'GET' if it's a GET request
          headers: {
            "Content-Type": "application/json", // Ensure proper content type
            Accept: "application/json",
          },
          body: JSON.stringify({ accessToken, cookieHeader: cookies }), // Remove if using GET request
        }
      );

      console.log("from auth context for userData: ", response);
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }

    setIsLoading(false);
  };

  const getToken = async () => {
    const jwtResponse = await fetch(
      "http://localhost:5000/api/auth/generateJWT",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (jwtResponse.ok) {
      const { token } = await jwtResponse.json();
      // localStorage.setItem("supabase_jwt", token);

      // **Set the token in Supabase auth**
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      const userData = await supabase.auth.getUser();
      setAuthUser(userData.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      console.error("Failed to generate JWT");
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   setCurrentUser({
  //     firstName: "Mussadiq",
  //     lastName: "Mehmood",
  //     email: "Mussadiq@gmail.com",
  //     userName: "MussadiqMehmood",
  //     accountId: "67a1fdfaff275daed5017dc7",
  //     userId: "5cc1b08ad62ec72e8378dd3",
  //     role: "ADMIN",
  //     avatarUrl:
  //       "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
  //   });
  //   getToken();

  //   // getUserData();
  // }, []);

  useEffect(() => {
    setCurrentUser({
      firstName: "Mukarram",
      lastName : "Nawaz",
      userName: "MukarramNawaz",
      email: "mukarram@gmail.com",
      accountId: "67a1fdfaff275daed5015bb4",
      userId: "5cc1b08ad62ec72e8388cb4",
      role: "ADMIN",
      avatarUrl:
        "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    });
    getToken();

    // getUserData();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await loginToSocialHub(email, password);
      if (response?.accessToken) {
        console.log("from auth context: ", response);
        setCurrentUser(response.userData);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("accessToken");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        isLoading,
        authUser,
        currentUserUsers,
        currentUserTeams,
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
