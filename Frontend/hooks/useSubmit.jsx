import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { backendURL } from "../utils/exports";
import { toast } from "react-toastify";

const useSubmit = ({ isAuth = false } = {}) => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const submit = useCallback(
    async (endpoint, body, options = {}) => {
      const { method = "POST" } = options;

      const isFormData = body instanceof FormData;

      setLoading(true);
      setData(null);

      try {
        const headers = {
          Accept: "application/json",
        };

        if (!isFormData) {
          headers["Content-Type"] = "application/json";
        }

        if (isAuth && token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `${backendURL}${endpoint}`,
          {
            method,
            headers,
            credentials: "include",
            body: isFormData ? body : JSON.stringify(body),
          },
        );

        const json = await res.json();

        if (!res.ok) {
          const errorMessage = json.errors || json.message || "Something went wrong";
          console.error(`API Error [${res.status}]:`, errorMessage, json);
          toast.error(errorMessage);
          return null;
        }

        setData(json);
        return json;
      } catch (err) {
        const message = err.message || "Network error";
        console.error("Request error:", message, err);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuth, token],
  );

  return { submit, loading, data };
};

export default useSubmit;
