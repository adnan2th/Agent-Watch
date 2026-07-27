import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { X, UserCheck, Building2, User, Mail, Lock, Shield, Key, Sparkles, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, registerAccount, logoutUser, setActiveView } = useAgentWatch();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [accountType, setAccountType] = useState<'Company' | 'Individual'>('Company');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('AI Security Engineer');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) return;

    setIsSubmitting(true);
    try {
      await registerAccount({
        fullName: fullName.trim(),
        email: email.trim(),
        accountType,
        companyName: accountType === 'Company' ? (companyName.trim() || 'My Company Workspace') : `${fullName}'s Individual Workspace`,
        role: role.trim() || 'Agent Security Admin'
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsSubmitting(false);
        onClose();
        setActiveView('dashboard');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans text-slate-200 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0d1117] border border-cyan-500/40 rounded-xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED IN ACCOUNT VIEW */}
        {currentUser && !successMsg ? (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-lg">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{currentUser.fullName}</h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                    {currentUser.accountType}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{currentUser.email}</p>
              </div>
            </div>

            <div className="p-3 rounded bg-[#05070a] border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Organization Workspace:</span>
                <strong className="text-white">{currentUser.companyName}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Role:</span>
                <strong className="text-cyan-300">{currentUser.role}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Workspace Member Since:</span>
                <strong className="text-slate-300">{currentUser.createdDate}</strong>
              </div>
            </div>

            <div className="p-3 rounded bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Live Agent Watch API Key:
              </div>
              <code className="block p-1.5 rounded bg-black/70 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                {currentUser.apiKey}
              </code>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setMode('register');
                }}
                className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out Account
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveView('dashboard');
                }}
                className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                Go to Mission Control
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : successMsg ? (
          /* REGISTRATION SUCCESS VIEW */
          <div className="py-8 text-center space-y-3 font-mono">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
            <p className="text-xs text-slate-400">Welcome to AgentWatch. Your workspace & API key are now active.</p>
          </div>
        ) : (
          /* NEW REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Header */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">
                  {mode === 'register' ? 'Register Account / Workspace' : 'Sign In to AgentWatch'}
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'register' 
                  ? 'Sign up as an Individual or Company to monitor & protect autonomous AI agents.' 
                  : 'Enter your credentials to access your organization workspace.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-0.5 rounded bg-[#05070a] border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 rounded font-bold cursor-pointer transition-all ${
                  mode === 'register' ? 'bg-cyan-500 text-[#05070a] shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create New Account
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 rounded font-bold cursor-pointer transition-all ${
                  mode === 'login' ? 'bg-cyan-500 text-[#05070a] shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Existing User Sign In
              </button>
            </div>

            {/* Account Type Toggle (Company vs Individual) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded bg-[#05070a] border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAccountType('Company')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    accountType === 'Company'
                      ? 'bg-cyan-950/40 border-cyan-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${accountType === 'Company' ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold text-[11px]">Company / Team</div>
                    <div className="text-[9px] text-slate-500">Multi-agent workspace</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('Individual')}
                  className={`p-2 rounded border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    accountType === 'Individual'
                      ? 'bg-cyan-950/40 border-cyan-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className={`w-4 h-4 ${accountType === 'Individual' ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold text-[11px]">Individual</div>
                    <div className="text-[9px] text-slate-500">Personal AI builder</div>
                  </div>
                </button>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Company / Org Name */}
            {mode === 'register' && accountType === 'Company' && (
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp / NextGen AI Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {isSubmitting ? 'Provisioning Account...' : mode === 'register' ? 'Register & Generate API Key' : 'Sign In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
