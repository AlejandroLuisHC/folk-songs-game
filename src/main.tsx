import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import App from "./App.tsx";
import QueryProvider from "./providers/QueryProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryProvider>
            <>
                <Header />
                <main>
                    <App />
                </main>
                <Footer />
            </>
        </QueryProvider>
    </React.StrictMode>,
);
