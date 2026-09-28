import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./rebuild/Home.jsx";
import ProjectPage from "./rebuild/ProjectPage.jsx";
import { InsightsPage, ArticlePage } from "./rebuild/Insights.jsx";
import { PROJECTS } from "./rebuild/projects.js";
import IntakeForm from "./IntakeForm.jsx";

/* Path-based routing. Real URLs per the rebuild plan sitemap (part 3).
   /intake keeps working exactly as before; it gets restyled in phase 4. */
function route() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const search = new URLSearchParams(window.location.search);

  if (path.startsWith("/intake") || search.has("intake")) return <IntakeForm />;

  const work = path.match(/^\/work\/([a-z0-9-]+)$/);
  if (work && PROJECTS[work[1]]) return <ProjectPage slug={work[1]} />;

  if (path === "/insights") return <InsightsPage />;
  const art = path.match(/^\/insights\/([a-z0-9-]+)$/);
  if (art) return <ArticlePage slug={art[1]} />;

  return <Home />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{route()}</React.StrictMode>
);
