import CreateDOM from "react-dom/client";
import App from "./app/App";
import 'virtual:svg-icons-register';

CreateDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
