import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useAuthContext();

  const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      if (res.ok) {
        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(data));

        // set the user in the context
        dispatch({ type: "LOGIN", payload: data });
      }
    } catch (error) {
      console.log("Error logging in: ", error.message);
    } finally {
      setLoading(false);
    }
  };
  return { error, loading, login };
};
