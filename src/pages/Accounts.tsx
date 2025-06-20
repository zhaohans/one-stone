import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAccountsContext } from "@/contexts/AccountsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, User, Building2 } from "lucide-react";
import CreateAccountModal from "@/components/CreateAccountModal";
import { Account } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Accounts = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    account_type: "all",
    account_status: "all",
    base_currency: "all",
    client_search: "",
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const { accounts, isLoading, createAccount, bulkUpdateAccounts } =
    useAccountsContext();
  const { toast } = useToast();
  const [view, setView] = useState<"client" | "bank">("client");

  const handleAccountClick = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    setSelectedAccounts((prevSelected) =>
      checked
        ? [...prevSelected, accountId]
        : prevSelected.filter((id) => id !== accountId),
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectedAccounts(checked ? accounts.map((account) => account.id) : []);
  };

  const handleBulkAction = async () => {
    if (selectedAccounts.length === 0 || !bulkAction) return;

    try {
      let status: Account["account_status"] = "active";
      if (bulkAction === "activate") status = "active";
      else if (bulkAction === "suspend") status = "suspended";
      else if (bulkAction === "close") status = "closed";

      const result = await bulkUpdateAccounts(selectedAccounts, {
        account_status: status,
      });

      if (result?.success) {
        toast({
          title: "Success",
          description: `Successfully ${bulkAction}d ${selectedAccounts.length} accounts.`,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to ${bulkAction} accounts.`,
          variant: "destructive",
        });
      }
      setSelectedAccounts([]);
      setBulkAction("");
    } catch (error) {
      console.error("Bulk action error:", error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount?: number, currency = "USD") => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Group accounts by base_currency as a placeholder for bank/custodian for Bank View
  const accountsByBank = accounts.reduce(
    (acc, account) => {
      // TODO: Replace base_currency with actual bank/custodian property if available
      const bank = account.base_currency || "Unknown Bank";
      if (!acc[bank]) acc[bank] = [];
      acc[bank].push(account);
      return acc;
    },
    {} as Record<string, Account[]>,
  );

  // Add possible filter options (replace with real data if available)
  const accountTypes = Array.from(
    new Set(accounts.map((a) => a.account_type).filter(Boolean)),
  );
  const currencies = Array.from(
    new Set(accounts.map((a) => a.base_currency).filter(Boolean)),
  );
  const statuses = Array.from(
    new Set(accounts.map((a) => a.account_status).filter(Boolean)),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
            Manage your client accounts and bank authorizations here.
          </p>
        </div>
      </div>

      {/* View Toggle - Tabs */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "client" | "bank")}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="client" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Client View</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Bank View</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Account Type filter */}
            <Select
              value={filters.account_type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, account_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Currency filter */}
            <Select
              value={filters.base_currency}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, base_currency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {currencies.map((cur) => (
                  <SelectItem key={cur} value={cur}>
                    {cur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter */}
            <Select
              value={filters.account_status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, account_status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Search by client */}
            <Input
              type="text"
              placeholder="Search client..."
              value={filters.client_search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  client_search: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({
                  account_type: "all",
                  account_status: "all",
                  base_currency: "all",
                  client_search: "",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table or Bank View */}
      {view === "client" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Accounts
              <div className="flex items-center space-x-2">
                {selectedAccounts.length > 0 && (
                  <>
                    <Select onValueChange={setBulkAction}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Bulk actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activate">Activate</SelectItem>
                        <SelectItem value="suspend">Suspend</SelectItem>
                        <SelectItem value="close">Close</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                      Apply ({selectedAccounts.length})
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedAccounts.length === accounts.length &&
                          accounts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">AUM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Opening Date</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow
                      key={account.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAccountClick(account.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.id)}
                          onChange={(e) =>
                            handleSelectAccount(account.id, e.target.checked)
                          }
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {account.account_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.account_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {account.client?.first_name}{" "}
                            {account.client?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.client?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {account.account_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.base_currency}</TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">
                            {formatCurrency(
                              account.total_aum,
                              account.base_currency,
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.holdings_count} holdings
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(account.account_status)}
                        >
                          {account.account_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(account.opening_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Bank View: group by base_currency as a placeholder for bank/custodian
        <div className="space-y-6">
          {Object.entries(accountsByBank).map(([bank, bankAccounts]) => (
            <Card key={bank} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span role="img" aria-label="Bank">
                    🏦
                  </span>{" "}
                  {bank}{" "}
                  <span className="text-sm text-gray-500">
                    ({bankAccounts.length} accounts)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Authorization</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>AUM</TableHead>
                      <TableHead>Holdings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.account_name}</TableCell>
                        <TableCell>{account.account_number}</TableCell>
                        <TableCell>
                          {account.client?.first_name}{" "}
                          {account.client?.last_name}
                        </TableCell>
                        <TableCell>{account.account_type}</TableCell>
                        <TableCell>{account.account_status}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{account.base_currency}</TableCell>
                        <TableCell>
                          {formatCurrency(
                            account.total_aum,
                            account.base_currency,
                          )}
                        </TableCell>
                        <TableCell>{account.holdings_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 text-sm text-gray-500">
                  Summary: {bankAccounts.length} accounts
                  {/* Add more summary info as needed */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateAccount={createAccount}
      />
    </div>
  );
};

export default Accounts;
