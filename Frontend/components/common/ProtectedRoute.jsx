"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      router.replace("/");
    }
  }, [pathname, router, token, user]);

  if (!token || !user) {
    return null;
  }

  return children;
}
