import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SimpleAuthProvider } from "../../contexts/SimpleAuthContext";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { ClientsProvider } from "../../contexts/ClientsContext";
import { AccountsProvider } from "../../contexts/AccountsContext";
import Dashboard from "../../pages/Dashboard";
import ClientManagement from "../../pages/ClientManagement";
import Accounts from "../../pages/Accounts";
import Trades from "../../pages/Trades";
import Messages from "../../pages/Messages";
import FeeReports from "../../pages/FeeReports";
import DocumentsTable from "../../components/DocumentsTable";
import InvoiceSystem from "../../pages/InvoiceSystem";
import News from "../../pages/News";
import ComplianceDashboard from "../../pages/ComplianceDashboard";
import Settings from "../../pages/Settings";

describe("Main Page Snapshots", () => {
  it("Dashboard matches snapshot", () => {
    const { asFragment } = render(<Dashboard />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("Clients matches snapshot", () => {
    const { asFragment } = render(<ClientManagement />, {
      wrapper: AllProviders,
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("Accounts matches snapshot", () => {
    const { asFragment } = render(<Accounts />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("Trades matches snapshot", () => {
    const { asFragment } = render(<Trades />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("Messages matches snapshot", () => {
    const { asFragment } = render(<Messages />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("FeeReports matches snapshot", () => {
    const { asFragment } = render(<FeeReports />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("DocumentsTable matches snapshot", () => {
    const { asFragment } = render(<DocumentsTable />, {
      wrapper: AllProviders,
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("InvoiceSystem matches snapshot", () => {
    const { asFragment } = render(<InvoiceSystem />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("News matches snapshot", () => {
    const { asFragment } = render(<News />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
  it("ComplianceDashboard matches snapshot", () => {
    const { asFragment } = render(<ComplianceDashboard />, {
      wrapper: AllProviders,
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("Settings matches snapshot", () => {
    const { asFragment } = render(<Settings />, { wrapper: AllProviders });
    expect(asFragment()).toMatchSnapshot();
  });
});

// Helper to wrap components in all required providers
const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <SimpleAuthProvider>
      <SettingsProvider>
        <ClientsProvider>
          <AccountsProvider>{children}</AccountsProvider>
        </ClientsProvider>
      </SettingsProvider>
    </SimpleAuthProvider>
  </MemoryRouter>
);
