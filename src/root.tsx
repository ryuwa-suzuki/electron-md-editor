import { createRoot } from "react-dom/client";

import { App }from "./App";

function render() {
  const root = createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();
