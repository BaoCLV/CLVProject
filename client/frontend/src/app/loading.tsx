// src/app/loading.tsx
'use client'

import { useEffect } from "react";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'; // Import the default NProgress styles

export default function Loading() {
  useEffect(() => {
    NProgress.start();  // Start the progress bar on mount
    return () => {
      NProgress.done();  // Complete the progress bar on unmount
    };
  }, []);

  return null; // Optionally, you can add a fallback UI or spinner here
}
