import { createSignal } from "solid-js";
import styles from "./App.module.css";
import AppBox from "./components/AppBox";

function App() {
  return (
    <div class={styles.App}>
      {[1, 2].map((row) => (
        <div key={`key-${row}`} class={styles.Row}>
          {[1, 2].map((col) => (
            <AppBox appId={`app-${row}-${col}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
