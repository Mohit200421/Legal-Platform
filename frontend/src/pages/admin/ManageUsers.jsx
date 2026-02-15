import API from "../../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  X,
  Filter,
  ChevronDown,
  Trash2,
  Eye,
  AlertCircle,
  Users as UsersIcon,
  Ban,
  CheckCheck
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  useEffect(() => {
    let result = [...users];

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(u => u.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
      setSelectedUser(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case "admin":
        return {
          icon: Shield,
          text: "Admin",
          bg: "bg-purple-100",
          textColor: "text-purple-700",
          border: "border-purple-200"
        };
      case "lawyer":
        return {
          icon: User,
          text: "Lawyer",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          border: "border-blue-200"
        };
      default:
        return {
          icon: UsersIcon,
          text: "User",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200"
        };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return {
          icon: CheckCircle,
          text: "Active",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200"
        };
      case "inactive":
        return {
          icon: Clock,
          text: "Inactive",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200"
        };
      case "suspended":
        return {
          icon: Ban,
          text: "Suspended",
          bg: "bg-red-100",
          textColor: "text-red-700",
          border: "border-red-200"
        };
      default:
        return {
          icon: XCircle,
          text: status || "Unknown",
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          border: "border-gray-200"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-green-600 px-3 py-1 mb-3">
              <UsersIcon className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xs font-medium text-green-600">USER MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Manage Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered users
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-gray-300 bg-white text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="lawyer">Lawyers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent animate-spin"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No users found</p>
            <p className="text-xs text-gray-400">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No users registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Registered Users
                </h2>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    const statusBadge = getStatusBadge(user.status);
                    const RoleIcon = roleBadge.icon;
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {user._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs border ${roleBadge.border} ${roleBadge.bg} ${roleBadge.textColor}`}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleBadge.text}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {/* Status Update Dropdown */}
                            <select
                              onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                              value={user.status}
                              className="p-2 border border-gray-300 text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
                            >
                              <option value="active">Set Active</option>
                              <option value="inactive">Set Inactive</option>
                              <option value="suspended">Suspend</option>
                            </select>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-full max-w-2xl border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">User Details</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs border ${
                      selectedUser.role === "admin" 
                        ? "border-purple-200 bg-purple-100 text-purple-700"
                        : selectedUser.role === "lawyer"
                        ? "border-blue-200 bg-blue-100 text-blue-700"
                        : "border-green-200 bg-green-100 text-green-700"
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs border ${
                      selectedUser.status === "active" 
                        ? "border-green-200 bg-green-100 text-green-700"
                        : selectedUser.status === "inactive"
                        ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                        : "border-red-200 bg-red-100 text-red-700"
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-sm text-gray-600">{selectedUser._id}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p className="text-sm text-gray-600">
                      {selectedUser.createdAt 
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete User</span>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">About User Management</h3>
            <p className="text-xs text-blue-700">
              You can update user status (active, inactive, suspended) or delete users. Deleted users cannot be recovered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}