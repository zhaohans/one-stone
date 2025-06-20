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

    // Normalize routes for comparison (remove leading/trailing slashes)
    const normalize = (r: string) => r.replace(/^\/+|\/+$/g, "");
    const appRoutesNorm = appRoutes.map(normalize);
    const sidebarRoutesNorm = sidebarRoutes.map(normalize);

    // Check for missing routes in either direction
    const missingInSidebar = appRoutesNorm.filter(
      (r) => !sidebarRoutesNorm.includes(r),
    );
    const missingInRoutes = sidebarRoutesNorm.filter(
      (r) => !appRoutesNorm.includes(r),
    );

    expect(missingInSidebar).toEqual([]);
    expect(missingInRoutes).toEqual([]);
  });
});
