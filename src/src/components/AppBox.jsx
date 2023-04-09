import { createSignal } from "solid-js";
import { os, events } from "@neutralinojs/lib";

import {
  apps,
  appRepoNameMapping,
  getRepoLocation,
  getSetupScriptsLocation,
} from "../config/apps.mjs";

import styles from "../App.module.css";

const activeProcesses = {};

function AppBox({ appId }) {
  const [logs, setLogs] = createSignal([]);
  const [appLocation, setAppLocation] = createSignal("");

  const appendLog = (log) => {
    setLogs((prev) => [...prev, log]);
  };

  const setupApp = async () => {
    const { stdOut: currentDirectory } = await os.execCommand(`pwd`);
    const appName = apps[appId];
    const repoName = appRepoNameMapping[appName];
    if (currentDirectory) {
      const appLocation = getRepoLocation(currentDirectory, repoName);
      appendLog(appLocation);
      setAppLocation(appLocation);

      // Initiate setup scripts
      const setupScriptsLocation = getSetupScriptsLocation(currentDirectory);
      const { stdOut: setupScriptLog } = await os.execCommand(
        `node ${setupScriptsLocation} ${appName}`
      );

      if (setupScriptLog) {
        appendLog(setupScriptLog);
      }
    }
  };

  const runApp = async () => {
    const currentAppProcess = activeProcesses[appId];
    if (!currentAppProcess) {
      const { id, pid } = await os
        .spawnProcess(`cd ${appLocation()} && node.index.js`)
        .catch((e) => console.log(e));
      events.on("spawnedProcess", (evt) => {
        if (id === evt.detail.id) {
          switch (evt.detail.action) {
            case "stdOut":
              appendLog(`OUT => ${evt.detail.data}`);
              break;
            case "stdIn":
              appendLog(`IN => ${evt.detail.data}`);
            case "exit":
              delete activeProcesses[appId];
              appendLog("EXIT");
            default:
              break;
          }
        }
      });
      activeProcesses[appId] = { id, pid };
    }
  };

  const runCommand = async () => {
    const currentAppProcess = activeProcesses[appId];
    if (!isNaN(currentAppProcess?.id)) {
      // await os
      //   .updateSpawnedProcess(
      //     currentAppProcess?.id,
      //     "stdIn",
      //     "console.log(5 + 5);"
      //   )
      //   .catch((e) => console.log(e));
      // await os
      //   .updateSpawnedProcess(currentAppProcess?.id, "stdInEnd")
      //   .catch((e) => console.log(e));

      // const pcs = await os.getSpawnedProcesses();
      // console.log(pcs);

      // setTimeout(async () => {
      //   console.log("Exiting");
      //   await os
      //     .updateSpawnedProcess(currentAppProcess?.id, "exit")
      //     .catch((e) => console.log(e));
      // }, 5000);
    }
  };

  return (
    <div key={appId} class={styles.HalfCol}>
      <span>{appId}</span>
      <div>
        <select>
          {Object.keys(apps).map((appKey) => (
            <option value={apps[appKey]} selected={appKey === appId}>
              {apps[appKey]}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setupApp();
          }}
        >
          Setup
        </button>
        <button
          onClick={() => {
            runApp();
          }}
        >
          Run
        </button>

        <button
          onClick={() => {
            runCommand();
          }}
        >
          Cmd
        </button>
        <button
          onClick={() => {
            setLogs([]);
          }}
        >
          Clear
        </button>
      </div>
      <textarea
        class={styles.TextArea}
        placeholder="Process logs"
        disabled
        value={logs() && logs().join("\n")}
      />
    </div>
  );
}

export default AppBox;
