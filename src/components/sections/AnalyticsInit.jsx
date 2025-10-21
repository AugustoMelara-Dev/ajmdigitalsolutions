// src/components/AnalyticsInit.tsx
"use client";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase-client";

export default function AnalyticsInit() {
  useEffect(() => { initAnalytics(); }, []);
  return null;
}
