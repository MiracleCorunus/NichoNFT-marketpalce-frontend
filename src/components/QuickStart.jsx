import { Card, Timeline, Typography } from "antd";
import React, { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function QuickStart({ isServerInfo }) {
  const { Moralis } = useMoralis();
  const { t } = useTranslation();

  const isInchDex = useMemo(
    () => (Moralis.Plugins?.oneInch ? true : false),
    [Moralis.Plugins?.oneInch]
  );

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Card style={styles.card} title={<h1 style={styles.title}>📝 {t("ToDoList")}</h1>}>
        <Timeline mode="left" style={styles.timeline}>
          <Timeline.Item dot="📄">
            <Text delete style={styles.text}>
              {t("cloneOrFork")}{" "}
              <a
                href="https://github.com/ethereum-boilerplate/ethereum-boilerplate#-quick-start"
                target="_blank"
                rel="noopener noreferrer"
              >
                ethereum-boilerplate
              </a>{" "}
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💿">
            <Text delete style={styles.text}>
              {t("installDependencies")} <Text code>npm install</Text>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🧰">
            <Text delete={isServerInfo} style={styles.text}>
              {t("signUpAccount")}{" "}
              <a
                href="https://moralis.io?utm_source=boilerplatehosted&utm_medium=todo&utm_campaign=ethereum-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("moralis")}
              </a>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💾">
            <Text delete={isServerInfo} style={styles.text}>
              {t("createMoralisServer")} (
              <a
                href="https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("howStartMoralis")}
              </a>
              )
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🔏">
            <Text delete={isServerInfo} style={styles.text}>
              {t("rename")} <Text code>.env.example</Text> to <Text code>.env</Text> and provide your{" "}
              <Text strong>appId</Text> and <Text strong>serverUrl</Text> from{" "}
              <a
                href="https://moralis.io?utm_source=boilerplatehosted&utm_medium=todo&utm_campaign=ethereum-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("moralis")}
              </a>
              :
            </Text>
            <Text code delete={isServerInfo} style={{ display: "block" }}>
              REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
            </Text>
            <Text code delete={isServerInfo} style={{ display: "block" }}>
              REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.grandmoralis.com:2053/server
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🔁">
            <Text delete={isServerInfo} style={styles.text}>
              {t("stopApp")} <Text code>npm run start</Text>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💿">
            <Text delete={isInchDex} style={styles.text}>
              {t("install")}{" "}
              <a
                href="https://moralis.io/plugins/1inch/?utm_source=boilerplatehosted&utm_medium=todo&utm_campaign=ethereum-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
              >
                1inch Moralis Plugin
              </a>{" "}
              {t("neededForThe")}<Text code>{"<InchDex />"}</Text> {t("componentOptional")}
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🚀">
            <Text style={styles.text}>{t("build")}</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
      <div>
        <Card
          style={styles.card}
          title={<h1 style={styles.title}>💣 {t("startingLocalChain")}</h1>}
        >
          <Timeline mode="left" style={styles.timeline}>
            <Timeline.Item dot="💿">
              <Text style={styles.text}>
                {t("install")}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/truffle"
                >
                  Truffle
                </a>{" "}
                {t("and")}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/ganache-cli"
                >
                  ganache-cli
                </a>{" "}
                <Text code>npm install -g ganache-cli truffle</Text>
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="⚙️">
              <Text style={styles.text}>
                {t("startlocalDevchain")} <Text code>npm run devchain</Text> {t("onNewTerminal")}
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="📡">
              <Text style={styles.text}>
                {t("deployContract")} <Text code>npm run deploy</Text> {t("onNewTerminal")}
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="✅" style={styles.text}>
              <Text>
                {t("openThe")} <Text strong>📄 {t("contract")}</Text> tab
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
        <Card
          style={{ marginTop: "10px", ...styles.card }}
          title={<h1 style={styles.title}>📡 {t("connectingChainMoralisDB")}</h1>}
        >
          <Timeline mode="left" style={styles.timeline}>
            <Timeline.Item dot="💿">
              <Text style={styles.text}>
                {t("download")}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fatedier/frp/releases"
                >
                  frpc
                </a>{" "}
                {t("provideMissing")} <Text code>.env</Text> t("file")
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="⚙️">
              <Text style={styles.text}>
                {t("connectMoralisDatabase")} <Text code>npm run connect</Text>
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="💾">
              <Text style={styles.text}>
                {t("addContractEvents")} <Text code>npm run watch:events</Text>
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
  );
}
