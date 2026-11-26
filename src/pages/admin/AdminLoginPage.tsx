import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAsAdmin } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAsAdmin(passcode);
    if (!success) {
      setErrorMsg('Passcode salah. Gunakan passcode default: "kalara2026" atau "admin"');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4 py-20 text-white">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center text-white">
            <Lock size={20} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-white">
            KALARA Portal Admin
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            Restricted Staff Access
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/60 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Admin Passcode / Password
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Masukkan passcode admin..."
              className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white p-3 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 uppercase font-black tracking-widest text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="p-3 bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 text-center font-mono">
          Demo Passcode: <span className="text-white font-bold">kalara2026</span>
        </div>
      </div>
    </div>
  );
};
