import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Plus, FileDown, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";

// Placeholder data for demo
const PLACEHOLDER_EMPLOYEES = [
  {
    id: 1,
    name: "Alice Smith",
    department: "Compliance",
    role: "Officer",
    status: "up_to_date",
    last: "2024-01-10",
    next: "2025-01-10",
    provider: "ACME Training",
  },
  {
    id: 2,
    name: "Bob Lee",
    department: "Finance",
    role: "Analyst",
    status: "expiring",
    last: "2023-08-01",
    next: "2024-08-01",
    provider: "SafeCert",
  },
  {
    id: 3,
    name: "Carol Jones",
    department: "Compliance",
    role: "Manager",
    status: "expired",
    last: "2022-06-15",
    next: "2023-06-15",
    provider: "ACME Training",
  },
];

const STATUS_COLORS = {
  up_to_date: "bg-green-500",
  expiring: "bg-yellow-500",
  expired: "bg-red-500",
};
const STATUS_LABELS = {
  up_to_date: "Up to Date",
  expiring: "Expiring",
  expired: "Expired",
};
type StatusKey = keyof typeof STATUS_COLORS;

const ComplianceTraining = () => {
  const [filterDept, setFilterDept] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    status: "up_to_date",
    last: "",
    next: "",
    provider: "",
    proof: null,
  });
  const [errors, setErrors] = useState<any>({});

  // Debug: Log when component renders and modal state changes
  React.useEffect(() => {
    console.log("ComplianceTraining component rendered");
  }, []);
  React.useEffect(() => {
    console.log("Modal open state:", showModal);
  }, [showModal]);

  // Always use placeholder data for demo
  const employees = PLACEHOLDER_EMPLOYEES;
  const filtered = employees.filter(
    (e) =>
      (filterDept === "all" || e.department === filterDept) &&
      (filterRole === "all" || e.role === filterRole) &&
      (filterType === "all" || filterType === "all") &&
      (!search || e.name.toLowerCase().includes(search.toLowerCase())),
  );

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Name required";
    if (!formData.department) newErrors.department = "Department required";
    if (!formData.role) newErrors.role = "Role required";
    if (!formData.last) newErrors.last = "Last training date required";
    if (!formData.next) newErrors.next = "Next due date required";
    if (!formData.provider) newErrors.provider = "Provider required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setShowModal(false);
      setFormData({
        name: "",
        department: "",
        role: "",
        status: "up_to_date",
        last: "",
        next: "",
        provider: "",
        proof: null,
      });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Compliance Training
      </h1>
      {/* Page header and breadcrumb */}
      <div className="mb-4 flex items-center gap-4">
        <GraduationCap className="w-7 h-7 text-primary" />
        <div>
          <Breadcrumb>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Compliance</BreadcrumbItem>
            <BreadcrumbItem>Training</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      {/* Filter/search bar */}
      <Card className="mb-4">
        <CardContent className="flex flex-wrap gap-4 items-center py-4">
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Officer">Officer</SelectItem>
              <SelectItem value="Analyst">Analyst</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Training Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="AML">AML</SelectItem>
              <SelectItem value="KYC">KYC</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="ml-auto" size="sm">
            <FileDown className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              console.log("DEBUG: Add Training Record button clicked");
              setShowModal(true);
            }}
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Training Record
          </Button>
        </CardContent>
      </Card>
      {/* Table of employees */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Training Status</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="mb-2 text-xs text-blue-600 font-mono">
            DEBUG: Placeholder data count: {employees.length}
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Training</th>
                <th className="px-4 py-2 text-left">Next Due</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Proof</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    No records found. (Demo: Placeholder data should always
                    show)
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const statusKey = emp.status as StatusKey;
                  return (
                    <tr
                      key={emp.id}
                      className="border-b last:border-0 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {emp.name}
                      </td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2">{emp.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-semibold ${STATUS_COLORS[statusKey]}`}
                        >
                          {STATUS_LABELS[statusKey]}
                        </span>
                      </td>
                      <td className="px-4 py-2">{emp.last}</td>
                      <td className="px-4 py-2">{emp.next}</td>
                      <td className="px-4 py-2">{emp.provider}</td>
                      <td className="px-4 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Upload/View Proof"
                          className="hover:bg-blue-100"
                        >
                          <Upload className="w-4 h-4 text-blue-600" />
                        </Button>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit"
                          className="hover:bg-yellow-100"
                        >
                          <span className="sr-only">Edit</span>✏️
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          title="Delete"
                          className="ml-2 hover:bg-red-100"
                        >
                          <span className="sr-only">Delete</span>🗑️
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Add Training Record Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-blue-700">
              Add Training Record
            </DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-xs text-green-600 font-mono">
            DEBUG: Modal is open
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department *
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleFormChange("department", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Role *
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleFormChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Officer">Officer</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-red-600 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Training Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.last}
                    onChange={(e) => handleFormChange("last", e.target.value)}
                    aria-invalid={!!errors.last}
                  />
                  {errors.last && (
                    <p className="text-red-600 text-xs mt-1">{errors.last}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Next Due Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.next}
                    onChange={(e) => handleFormChange("next", e.target.value)}
                    aria-invalid={!!errors.next}
                  />
                  {errors.next && (
                    <p className="text-red-600 text-xs mt-1">{errors.next}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provider *
                  </label>
                  <Input
                    value={formData.provider}
                    onChange={(e) =>
                      handleFormChange("provider", e.target.value)
                    }
                    aria-invalid={!!errors.provider}
                  />
                  {errors.provider && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.provider}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Proof (PDF/Image)
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      handleFormChange("proof", e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* DEBUG: Render modal content directly if showModal is true */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl border-2 border-blue-200 p-8">
            <div className="mb-2 text-xs text-green-600 font-mono">
              DEBUG: Modal content rendered directly
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Employee Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Department *
                    </label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleFormChange("department", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role *
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleFormChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Officer">Officer</SelectItem>
                        <SelectItem value="Analyst">Analyst</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-red-600 text-xs mt-1">{errors.role}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Training Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.last}
                      onChange={(e) => handleFormChange("last", e.target.value)}
                      aria-invalid={!!errors.last}
                    />
                    {errors.last && (
                      <p className="text-red-600 text-xs mt-1">{errors.last}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Next Due Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.next}
                      onChange={(e) => handleFormChange("next", e.target.value)}
                      aria-invalid={!!errors.next}
                    />
                    {errors.next && (
                      <p className="text-red-600 text-xs mt-1">{errors.next}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Provider *
                    </label>
                    <Input
                      value={formData.provider}
                      onChange={(e) =>
                        handleFormChange("provider", e.target.value)
                      }
                      aria-invalid={!!errors.provider}
                    />
                    {errors.provider && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.provider}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Proof (PDF/Image)
                    </label>
                    <Input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) =>
                        handleFormChange("proof", e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* TODO: Integrate backend API for fetch/create/update/delete/search, automate reminders, and export */}
    </div>
  );
};

export default ComplianceTraining;
