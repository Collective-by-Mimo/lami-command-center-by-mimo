import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Fingerprint, ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { authenticateBiometric, isWebAuthnSupported } from '../utils/webauthn';
import { hapticTap, hapticWarning } from '../utils/haptics';

export const LoginScreen: React.FC = () => {
  const { login, loginBiometric, language, isRTL, isBiometricEnabled } = useApp();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const labels = {
    subtitle: {
      pt: 'Seu mundo, organizado com discrição.',
      en: 'Your world, quietly in order.',
      he: 'עולמך, מסודר בשקט.'
    },
    usernameLabel: {
      pt: 'Nome de Usuário',
      en: 'Username',
      he: 'שם משתמש'
    },
    passwordLabel: {
      pt: 'Senha de Acesso',
      en: 'Access Password',
      he: 'סיסמת גישה'
    },
    usernamePlaceholder: {
      pt: 'Informe seu usuário',
      en: 'Enter your username',
      he: 'הזן שם משתמש'
    },
    loginButton: {
      pt: 'Entrar',
      en: 'Enter',
      he: 'כניסה'
    },
    errorMsg: {
      pt: 'Usuário ou senha incorretos. Acesso restrito.',
      en: 'Invalid username or password. Restricted access.',
      he: 'שם משתמש או סיסמה שגויים. הגישה מוגבלת.'
    },
    encryptedNote: {
      pt: 'Acesso privado • Mimo Collective Dubai',
      en: 'Private access • Mimo Collective Dubai',
      he: 'גישה פרטית • מימו קולקטיב דובאי'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    hapticTap();

    setTimeout(() => {
      const success = login(username, password);
      setIsSubmitting(false);

      if (!success) {
        hapticWarning();
        setErrorMessage(labels.errorMsg[language]);
      }
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden selection:bg-[#B8912E]/30"
      style={{ background: 'linear-gradient(160deg, #0A2E2A 0%, #0E3F3A 55%, #0A2E2A 100%)' }}
    >
      {/* Ambient gold glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(184,145,46,0.12) 0%, transparent 70%)' }} />

      {/* ── WARM CREAM CARD ── */}
      <div className="w-full max-w-sm relative z-10">

        {/* LM Gold Badge — floats above card */}
        <div className="flex justify-center mb-[-28px] relative z-20">
          <div
            className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(145deg, #C9A84C 0%, #B8912E 50%, #9A7520 100%)',
              boxShadow: '0 8px 32px rgba(184,145,46,0.45), 0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <span className="font-serif-display font-bold text-[#0E3F3A] text-[22px] leading-none tracking-tight select-none">LM</span>
          </div>
        </div>

        {/* Card body */}
        <div
          className="w-full rounded-3xl px-7 pt-12 pb-7 shadow-2xl"
          style={{ background: '#F7F5F1', boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)' }}
        >
          {/* Wordmark */}
          <div className="text-center mb-6">
            <h1 className="font-serif-display text-[28px] font-bold tracking-tight text-[#0E3F3A] leading-none">
              La<span className="text-[#B8912E]">Mi</span>
              <span className="text-[14px] font-sans font-light text-[#5C7A76] ml-2 tracking-widest uppercase align-middle">Dubai</span>
            </h1>
            <p className="mt-2 text-[12px] text-[#7A8C8A] leading-relaxed font-light tracking-wide">
              {labels.subtitle[language]}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#B8912E]/20" />
            <span className="text-[#B8912E] text-[10px] font-mono uppercase tracking-widest">Acesso</span>
            <div className="flex-1 h-px bg-[#B8912E]/20" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-[#B8912E] uppercase tracking-widest">
                {labels.usernameLabel[language]}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={labels.usernamePlaceholder[language]}
                className="w-full bg-transparent border-b-2 border-[#C8C0B0] focus:border-[#B8912E] py-2.5 text-[14px] text-[#1A3330] placeholder-[#B0A898] outline-none transition-colors"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-[#B8912E] uppercase tracking-widest">
                {labels.passwordLabel[language]}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b-2 border-[#C8C0B0] focus:border-[#B8912E] py-2.5 pr-9 text-[14px] text-[#1A3330] placeholder-[#B0A898] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8A9E9B] hover:text-[#B8912E] transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password.trim()}
              className="w-full mt-2 py-3.5 rounded-xl font-semibold text-[14px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #B8912E 100%)',
                color: '#0E3F3A',
                boxShadow: '0 4px 20px rgba(184,145,46,0.35)'
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {{ pt: 'Verificando...', en: 'Verifying...', he: 'מאמת...' }[language]}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {labels.loginButton[language]}
                </span>
              )}
            </button>

            {isBiometricEnabled && isWebAuthnSupported() && (
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  const success = await authenticateBiometric();
                  if (success) {
                    loginBiometric();
                  } else {
                    setErrorMessage('Biometric authentication failed.');
                  }
                  setIsSubmitting(false);
                }}
                className="w-full py-3 rounded-xl text-[13px] text-[#145A52] border border-[#145A52]/25 hover:bg-[#145A52]/5 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                {{ pt: 'Biometria', en: 'Biometric login', he: 'כניסה ביומטרית' }[language]}
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 text-center border-t border-[#B8912E]/15 flex items-center justify-center gap-1.5 text-[10px] text-[#9A8E82] font-mono tracking-wide">
            <ShieldCheck className="w-3 h-3 text-[#B8912E]" />
            <span>{labels.encryptedNote[language]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
