import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  KeyRound,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { profile, role, updateProfile, updatePassword } = useAuth();

  // Profile Edit State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setIsSavingProfile(true);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        photo_url: photoUrl.trim() || undefined,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile details.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify both fields.');
      return;
    }

    setIsSavingPassword(true);
    try {
      await updatePassword(newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const roleNameMap = {
    admin: 'Administrator',
    teacher: 'Faculty Teacher',
    student: 'Registered Scholar',
    parent: 'Guardian / Parent',
  };

  return (
    <PortalLayout
      pageTitle="Account & Profile Settings"
      pageSubtitle="Manage identity credentials, contact details, and security passwords"
    >
      <div className="max-w-4xl space-y-8">
        
        {/* Profile Card Summary Header */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <img
              src={profile?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={profile?.full_name || 'Profile'}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl"
            />
            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {profile?.full_name || 'Academy Member'}
              </h2>
              <Badge variant="purple">
                {role ? role.toUpperCase() : 'USER'}
              </Badge>
            </div>
            <p className="text-xs text-purple-300 font-medium">
              {role ? roleNameMap[role] : 'Member'} • Girls Academy Institutional Account
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                {profile?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                {profile?.phone || 'No phone set'}
              </span>
            </div>
          </div>
        </Card>

        {/* Section 1: Edit Profile Details Form */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">Personal Information</span>
            <h3 className="text-lg font-bold text-white mt-1">Edit Account Details</h3>
            <p className="text-xs text-slate-400">Update your public display name and registered contact telephone number.</p>
          </div>

          {profileSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile details updated and synchronized with Supabase!</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="Profile Avatar Image URL"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                helperText="Paste direct image link to update your portal avatar photo."
                leftIcon={<Camera className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registered Institutional Email (Fixed)"
                disabled
                value={profile?.email || ''}
                helperText="Email addresses are managed through the Academy Registrar."
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Designated Role"
                disabled
                value={role ? role.toUpperCase() : 'STUDENT'}
                helperText="Role permissions are enforced via PostgreSQL RLS policies."
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingProfile}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Section 2: Change Password Section */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-pink-400">Security Credentials</span>
            <h3 className="text-lg font-bold text-white mt-1">Change Account Password</h3>
            <p className="text-xs text-slate-400">Update your access password. Ensure it contains at least 6 characters.</p>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Password successfully changed! Your credentials are now secured.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password *"
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4" />}
              />
              <Input
                label="Confirm New Password *"
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="outline"
                size="md"
                isLoading={isSavingPassword}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </PortalLayout>
  );
};
