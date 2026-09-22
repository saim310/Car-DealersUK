"use client";

import { useSelector } from "react-redux";
import Login from "@/components/modals/Login";
import SignUp from "@/components/modals/SignUp";

export default function AuthModals() {
  const { token, user } = useSelector((state) => state.auth);

  if (token && user) {
    return null;
  }

  return (
    <>
      <Login />
      <SignUp />
    </>
  );
}
