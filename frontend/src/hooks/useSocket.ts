import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) return; // ✅ prevent duplicate

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    console.log("Creating WebSocket...");

    ws.onopen = () => {
      console.log("✅ Connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("❌ Closed");
      setSocket(null);
    };

    ws.onerror = (e) => {
      console.error("Error", e);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return socket;
};