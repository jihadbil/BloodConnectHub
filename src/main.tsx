import "./lib/forceLatinDigits";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// فرض اتجاه اليمين إلى اليسار ولغة الضاد عالمياً على مستوى المستند
document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";

createRoot(document.getElementById("root")!).render(<App />);
