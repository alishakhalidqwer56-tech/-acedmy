import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Mail, 
  Phone, 
  Lock, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  Pencil, 
  Trash2,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { fetchAllUsers, createUserAccount, toggleUserStatus, updateUserAccount, deleteUserAccount, setUserPassword } from '../../lib/dataService';
import { Profile, UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<Profile | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [showNewPasswordVal, setShowNewPasswordVal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Welcome2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('student');
  const [editIsActive, setEditIsActive] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await createUserAccount({
        full_name: fullName,
        email,
        role,
        phone,
        password
      });

      setToastMessage(`Account for ${fullName} (${role.toUpperCase()}) created successfully!`);
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      setPhone('');
      await loadUsers();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error creating user: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (u: Profile) => {
    setEditingUser(u);
    setEditFullName(u.full_name);
    setEditPhone(u.phone || '');
    setEditRole(u.role);
    setEditIsActive(u.is_active);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      await updateUserAccount(editingUser.id, {
        full_name: editFullName,
        phone: editPhone,
        role: editRole,
        is_active: editIsActive
      });

      setToastMessage(`User ${editFullName} updated successfully!`);
      setEditingUser(null);
      await loadUsers();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error updating user: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      await deleteUserAccount(deletingUser.id);
      setToastMessage(`User ${deletingUser.full_name} removed from academy records.`);
      setDeletingUser(null);
      await loadUsers();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: Profile) => {
    const nextStatus = !user.is_active;
    await toggleUserStatus(user.id, nextStatus);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: nextStatus } : u));
    setToastMessage(`User ${user.full_name} is now ${nextStatus ? 'Active' : 'Deactivated'}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !newPasswordVal.trim()) return;
    if (newPasswordVal.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await setUserPassword(passwordModalUser.email, newPasswordVal);
      setToastMessage(`Security password for ${passwordModalUser.full_name} (${passwordModalUser.email}) updated successfully!`);
      setPasswordModalUser(null);
      setNewPasswordVal('');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error updating password: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin': return <Badge variant="amber">ADMIN</Badge>;
      case 'teacher': return <Badge variant="purple">TEACHER</Badge>;
      case 'student': return <Badge variant="pink">STUDENT</Badge>;
      case 'parent': return <Badge variant="cyan">PARENT</Badge>;
      default: return <Badge variant="purple">USER</Badge>;
    }
  };

  return (
    <PortalLayout
      pageTitle="Academy User Accounts & RBAC Provisioning"
      pageSubtitle="Create, edit, suspend, or delete access credentials for students, faculty, parents, and administrative staff"
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by full name or email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181827] border border-[#2a2a3e] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-[#181827] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="student">Students</option>
              <option value="teacher">Faculty Teachers</option>
              <option value="parent">Parents / Guardians</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Provision New User
          </Button>
        </div>

        {/* Toast Message */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* User Accounts Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Member</th>
                  <th className="p-4 font-semibold">Institutional Email</th>
                  <th className="p-4 font-semibold">Assigned Role</th>
                  <th className="p-4 font-semibold">Phone Contact</th>
                  <th className="p-4 font-semibold text-center">Security Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={u.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-purple-500/30 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white">{u.full_name}</div>
                          <div className="text-[10px] text-slate-500">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="p-4">{getRoleBadge(u.role)}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{u.phone || '—'}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-colors ${
                            u.is_active
                              ? 'text-rose-400 border-rose-500/30 hover:bg-rose-500/10'
                              : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                          }`}
                          title={u.is_active ? 'Deactivate account' : 'Activate account'}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            setPasswordModalUser(u);
                            setNewPasswordVal('');
                            setShowNewPasswordVal(false);
                          }}
                          className="p-1.5 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Change user password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                          title="Edit user details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Provision User Account */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Provision Institutional Account</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mariam Siddiqui"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Academy Email Address *</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.siddiqui@girlsacademy.edu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">System Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Faculty Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (800) 555-0199"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Initial Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">User can change this password after first login.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Create User Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit User Account */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit User Account</h3>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                  <Input
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email (Read Only)</label>
                  <Input
                    disabled
                    value={editingUser.email}
                    className="opacity-60 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">System Role *</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Faculty Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Account Access Status</label>
                  <select
                    value={editIsActive ? 'active' : 'suspended'}
                    onChange={(e) => setEditIsActive(e.target.value === 'active')}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="suspended">Suspended (Access Revoked)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete User Confirmation */}
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete User Account?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete <span className="text-white font-semibold">{deletingUser.full_name}</span> ({deletingUser.email})? This action will remove all portal access.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  isLoading={isSubmitting}
                  onClick={handleDeleteUser}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Admin Password Reset for User */}
        {passwordModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Update User Password</h3>
                    <p className="text-[11px] text-slate-400">Account: {passwordModalUser.full_name} ({passwordModalUser.role.toUpperCase()})</p>
                  </div>
                </div>
                <button
                  onClick={() => setPasswordModalUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdminPasswordChange} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Account Email</label>
                  <input
                    disabled
                    value={passwordModalUser.email}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Set New Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPasswordVal ? 'text' : 'password'}
                      required
                      placeholder="Enter new secure password (min 6 characters)"
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPasswordVal(!showNewPasswordVal)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showNewPasswordVal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Once saved, the user must use this new password to access their portal desk.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordModalUser(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                    isLoading={isSubmitting}
                  >
                    Save New Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
