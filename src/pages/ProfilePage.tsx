import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { CollegeBrand } from '../components/common/CollegeBrand';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  ShieldCheck,
  Building,
  GraduationCap,
  Save,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await authService.getCurrentUser();
        setProfile(data);
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !profile) {
    return <LoadingState message="Loading Profile Record..." subMessage="Fetching student academic registry & mentor details" />;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await authService.updateProfile({
        name,
        email,
        phone,
      });
      setProfile(updated);
      setToastMessage('Profile changes saved successfully to database!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setToastMessage('Failed to update profile.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };


  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-extrabold text-xl flex items-center justify-center border-2 border-blue-700 shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {profile.rollNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {profile.department} • {profile.semester} • Section {profile.section}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CollegeBrand variant="sidebar" />
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic Credentials Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Institutional Registry
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Enrollment Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{profile.enrollmentNumber}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Academic Department</span>
              <span className="font-bold text-slate-900">{profile.department}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Mentor / Class Incharge</span>
              <span className="font-bold text-slate-900">{profile.mentorName}</span>
              <span className="text-[11px] text-blue-700 block mt-0.5 font-medium">Associate Professor, CSE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Campus Location</span>
              <span className="font-semibold text-slate-800">
                Plot No. 2, Knowledge Park III, Greater Noida, UP - 201306
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Contact & Personal Details */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900">Personal &amp; Contact Information</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Roll Number
                </label>
                <input
                  type="text"
                  defaultValue={profile.rollNumber}
                  disabled
                  className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Mobile Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                />

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Semester &amp; Section
                </label>
                <input
                  type="text"
                  defaultValue={`${profile.semester} - Section ${profile.section}`}
                  disabled
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Cumulative CGPA
                </label>
                <input
                  type="text"
                  defaultValue={profile.cgpa?.toFixed(2) || '8.65'}
                  disabled
                  className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
