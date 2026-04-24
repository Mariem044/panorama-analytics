import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
export function DashboardLayout() {
  const location = useLocation();
  return _jsxs("div", {
    className:
      "min-h-screen bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-hidden",
    children: [
      _jsx("div", {
        className:
          "absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/1 opacity-40 pointer-events-none",
      }),
      _jsx("div", {
        className:
          "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl opacity-25",
      }),
      _jsx("div", {
        className:
          "absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/6 to-transparent rounded-full blur-3xl opacity-20",
      }),
      _jsx(Sidebar, {}),
      _jsx(Header, { pathname: location.pathname }),
      _jsx("main", {
        className:
          "ml-0 lg:ml-[248px] pt-14 px-4 md:px-6 lg:px-8 py-5 md:py-6 lg:py-8 min-h-[calc(100vh-3.5rem)] transition-all duration-500 relative z-10",
        children: _jsx(Outlet, {}),
      }),
    ],
  });
}
