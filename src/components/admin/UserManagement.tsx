import { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { UserCheck, UserX, Coins, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../Pagination';

interface UserManagementProps {
  token: string | null;
}

export function UserManagement({ token }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token) fetchUsers(currentPage);
  }, [token, currentPage]);

  const fetchUsers = async (page: number = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers(token, page);
      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(data.data.pages);
        setCurrentPage(data.data.current_page);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: 'admin' | 'user') => {
    if (!token) return;
    try {
      const data = await adminService.updateUserRole(token, userId, newRole);
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? data.user : u));
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating role');
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    if (!token) return;
    try {
      const data = await adminService.toggleUserStatus(token, userId, !currentStatus);
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? data.user : u));
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading users...</div>;
  if (users.length === 0) return <div className="p-8 text-center text-gray-400">No users found</div>;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Summary Info */}
      <div className="p-4 bg-gray-800/30 border-b border-gray-800 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          <span className="text-gray-300 text-sm">Tổng cộng: <span className="text-white font-bold">{users.length}</span> users (trang này)</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-yellow-500" />
          <span className="text-gray-300 text-sm">Tổng token: <span className="text-yellow-500 font-bold">
            {users.reduce((acc, u) => acc + (u.token_balance || 0), 0).toLocaleString()}
          </span> (trang này)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tokens</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-6 py-4">
                  <span className="text-white font-semibold">{user.username}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                    <Coins size={14} />
                    <span>{user.token_balance?.toLocaleString() || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                    className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 hover:border-yellow-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${user.is_active
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                    }`}>
                    {user.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                    className={`p-2 rounded transition-colors ${user.is_active
                        ? 'bg-red-900/30 hover:bg-red-900 text-red-400'
                        : 'bg-green-900/30 hover:bg-green-900 text-green-400'
                      }`}
                    title={user.is_active ? 'Disable user' : 'Enable user'}
                  >
                    {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
