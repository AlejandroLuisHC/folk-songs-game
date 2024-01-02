import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Header />
        <main>
            <App />
        </main>
        <Footer />
    </React.StrictMode>,
);
