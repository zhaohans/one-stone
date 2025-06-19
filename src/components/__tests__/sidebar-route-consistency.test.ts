import fs from "fs";
import path from "path";

describe("Sidebar and Route Consistency", () => {
  it("should have all sidebar links present in the route config and vice versa", () => {
    // Read App.tsx and Sidebar.tsx as strings
    const appPath = path.resolve(__dirname, "../../App.tsx");
    const sidebarPath = path.resolve(__dirname, "../Sidebar.tsx");
    const appContent = fs.readFileSync(appPath, "utf-8");
    const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");

    // Extract route paths from App.tsx
    const routeRegex = /path="([^"]+)"/g;
    const appRoutes = Array.from(appContent.matchAll(routeRegex)).map(
      (m) => m[1],
    );

    // Extract sidebar paths from Sidebar.tsx
    const sidebarRegex = /path: '([^']+)'/g;
    const sidebarRoutes = Array.from(sidebarContent.matchAll(sidebarRegex)).map(
      (m) => m[1],
    );

    // Check for missing routes in either direction
    const missingInSidebar = appRoutes.filter(
      (r) => !sidebarRoutes.includes("/" + r) && !sidebarRoutes.includes(r),
    );
    const missingInRoutes = sidebarRoutes.filter(
      (r) =>
        !appRoutes.includes(r.replace(/^/, "")) &&
        !appRoutes.includes(r.replace(/^/, "").replace(/^/, "")),
    );

    expect(missingInSidebar).toEqual([]);
    expect(missingInRoutes).toEqual([]);
  });
});
