"use client";

import { useState, useEffect } from "react";

export function useVisitorIp() {
  const [ip, setIp] = useState<string>("...");

  useEffect(() => {
    async function fetchIp() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.error("Failed to fetch visitor IP:", err);
        setIp("Unknown");
      }
    }
    fetchIp();
  }, []);

  return ip;
}
