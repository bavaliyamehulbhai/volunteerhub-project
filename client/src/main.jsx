import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./src/routes/AppRoutes";
import {
  AuthProvider,
} from "./src/context/AuthContext";
import SessionGuard from "./src/components/SessionGuard";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <SessionGuard>
          <AppRoutes />
        </SessionGuard>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);