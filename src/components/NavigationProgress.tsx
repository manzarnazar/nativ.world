"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, minimum: 0.3, trickleSpeed: 200 });

export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Stop bar when route finishes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setTimeout(() => NProgress.done(), 100);
    }
  }, [pathname]);

  // Start bar on any anchor click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target === "_blank") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const targetUrl = new URL(href, window.location.href);
      if (targetUrl.pathname === window.location.pathname) return;

      NProgress.start();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
