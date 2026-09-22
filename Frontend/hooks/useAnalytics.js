"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const useAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const logVisit = async () => {
      const excludedPrefixes = [
        "/analytics",
        "/dashboard",
        "/admin",
        "/_next",
        "/assets/images/logo/Favicon.png",
        "/api",
      ];
      const isInternalRoute = excludedPrefixes.some((prefix) =>
        pathname.toLowerCase().startsWith(prefix.toLowerCase()),
      );

      if (isInternalRoute) return;

      try {
        if (typeof window !== "undefined") {

          const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://apis.ukaautotrade.co.uk";

   


          await fetch(`${apiUrl}/api/analytics/page-visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname }),
          });
        }
      } catch (error) {
        console.error("Analytics sync skipped or failed");
      }
    };

    if (pathname) logVisit();
  }, [pathname]);
};
