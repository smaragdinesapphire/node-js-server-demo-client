import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "antd";
import { Space } from "antd";
import axios from "axios";
import { notification } from "antd";

const inter = Inter({ subsets: ["latin"] });

const SEND_DATA = { name: "John", age: 30 };
export default function Home() {
  const wsRef = useRef();

  const handleSaveByWS = useCallback(() => {
    wsRef.current.send(JSON.stringify({ type: "save", data: SEND_DATA }));
  }, []);

  const handleLoadByWS = useCallback(() => {
    wsRef.current.send(JSON.stringify({ type: "load" }));
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.onmessage = (event) => {
      console.log("Received message from server:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const handleSaveByAxios = useCallback(() => {
    axios
      .post("http://localhost:8080/save", SEND_DATA)
      .then(() => notification.success())
      .catch(() => notification.error());
  }, []);

  const handleLoadByAxios = useCallback(
    () =>
      axios
        .get("http://localhost:8080/load")
        .then(({ data }) => console.log("success", data))
        .catch((e) => notification.error()),
    []
  );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Space>
          <span>WebSocket</span>
          <Button onClick={() => handleSaveByWS()}>Save</Button>
          <Button onClick={() => handleLoadByWS()}>Load</Button>
        </Space>
        <Space>
          <span>Axios</span>
          <Button onClick={() => handleSaveByAxios()}>Save</Button>
          <Button onClick={() => handleLoadByAxios()}>Load</Button>
        </Space>
      </main>
    </>
  );
}
