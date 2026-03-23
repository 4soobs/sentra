/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Globe, 
  Lock, 
  Search, 
  Brain, 
  RefreshCw,
  Info,
  ChevronRight,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Settings,
  Bell,
  Trash2,
  Shield,
  ExternalLink,
  Key,
  Languages,
  Sparkles
} from 'lucide-react';
import { analyzeWebsiteClaims } from './services/geminiService';

const ScoreCircle = ({ score, isDarkMode }) => {
  const isHigh = score >= 80;
  const isMid = score >= 50;
  
  const colorClass = isHigh ? "text-emerald-500" : isMid ? "text-amber-500" : "text-rose-500";
  const bgClass = isDarkMode 
    ? (isHigh ? "bg-emerald-500/10" : isMid ? "bg-amber-500/10" : "bg-rose-500/10")
    : (isHigh ? "bg-emerald-500/5" : isMid ? "bg-amber-500/5" : "bg-rose-500/5");
  
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center w-32 h-32 rounded-full ${bgClass} transition-all duration-700`}>
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="opacity-10"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
        />
      </svg>
      <span className={`font-bold text-4xl ${colorClass}`}>
        {score}
      </span>
    </div>
  );
};

const MetricCard = ({ 
  icon: Icon, 
  label, 
  score, 
  description,
  isDarkMode,
  onClick
}) => {
  const isHigh = score >= 80;
  const isMid = score >= 50;
  const colorClass = isHigh ? "text-emerald-500" : isMid ? "text-amber-500" : "text-rose-500";
  
  return (
    <button 
      onClick={onClick}
      className={`w-full border rounded-xl p-3 flex items-start gap-3 text-left transition-all duration-300 group active:scale-[0.98] ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' 
          : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
      }`}
    >
      <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${
        isDarkMode ? 'bg-white/5' : 'bg-gray-100'
      } ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-800'}`}>{label}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${colorClass}`}>{score}%</span>
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-300 group-hover:translate-x-0.5 ${
                isDarkMode ? 'text-white/30' : 'text-gray-400'
              }`} 
            />
          </div>
        </div>
        <p className={`text-[11px] leading-tight line-clamp-1 ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </button>
  );
};

const DetailPage = ({ 
  metric, 
  isDarkMode, 
  onBack,
  t
}) => {
  const isHigh = metric.score >= 80;
  const isMid = metric.score >= 50;
  const colorClass = isHigh ? "text-emerald-500" : isMid ? "text-amber-500" : "text-rose-500";

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`flex flex-col h-full w-full ${isDarkMode ? 'bg-bg-card-dark' : 'bg-bg-card-light'}`}
    >
      <div className={`p-4 border-b flex items-center gap-3 transition-colors duration-500 ${
        isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'
      }`}>
        <button 
          onClick={onBack}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-200 text-gray-500'
          }`}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-bold text-lg tracking-tight">{t.metricDetails}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} ${colorClass}`}>
            <metric.icon size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-1">{metric.label}</h3>
          <div className={`text-sm font-bold ${colorClass}`}>{metric.score}/100 Score</div>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
              {t.summary}
            </h4>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
              {metric.details}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
              {t.findings}
            </h4>
            {[
              { label: "Data Integrity", status: "Verified", icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Source Reliability", status: "High", icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Historical Context", status: "Consistent", icon: CheckCircle2, color: "text-emerald-500" }
            ].map((finding, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-white/5' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <finding.icon size={14} className={finding.color} />
                  <span className="text-xs font-medium">{finding.label}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase ${finding.color}`}>{finding.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-4 border-t transition-colors duration-500 ${
        isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'
      }`}>
        <button 
          onClick={onBack}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl transition-all"
        >
          {t.backToDashboard}
        </button>
      </div>
    </motion.div>
  );
};

const LoadingScreen = ({ isDarkMode, t }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center space-y-6 ${
        isDarkMode ? 'bg-bg-card-dark/95 backdrop-blur-sm' : 'bg-bg-card-light/95 backdrop-blur-sm'
      }`}
    >
      <div className="relative">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="text-emerald-500 animate-pulse" size={32} />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">{t.analyzing}</h3>
        <p className={`text-xs max-w-[200px] mx-auto leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
          {t.loadingDesc}
        </p>
      </div>

      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
};

const translations = {
  en: {
    dashboard: "Dashboard",
    settings: "Settings",
    setup: "Setup",
    welcome: "Welcome to TrustGuard",
    setupDesc: "Let's get your AI-powered credibility shield ready.",
    apiKeyLabel: "Gemini API Key",
    apiKeyDesc: "Your personal access token",
    apiKeyPlaceholder: "Enter your API key...",
    apiKeyNote: "Your token is stored locally and never sent to our servers.",
    getStarted: "Get Started",
    language: "Language",
    theme: "Theme",
    system: "System",
    light: "Light",
    dark: "Dark",
    reputation: "Reputation",
    domainInfo: "Domain Info",
    sslSecurity: "SSL Security",
    aiClaims: "AI Claims Check",
    highlyTrusted: "Highly Trusted",
    moderateRisk: "Moderate Risk",
    suspicious: "Suspicious",
    overallScore: "Overall Credibility Score",
    analyzing: "Analyzing Credibility",
    loadingDesc: "Our AI is scanning domain history, SSL certificates, and verifying website claims...",
    backToDashboard: "Back to Dashboard",
    metricDetails: "Metric Details",
    summary: "Analysis Summary",
    findings: "Key Findings",
    preferences: "Preferences",
    security: "Security",
    autoScan: "Auto-Scan",
    clearHistory: "Clear Scan History",
    about: "About",
    version: "Version",
    aiModel: "AI Model",
    privacy: "Privacy Policy",
    poweredBy: "Powered by Gemini AI",
    appName: "TrustGuard AI"
  },
  es: {
    dashboard: "Panel",
    settings: "Ajustes",
    setup: "Configuración",
    welcome: "Bienvenido a TrustGuard",
    setupDesc: "Preparemos su escudo de credibilidad impulsado por IA.",
    apiKeyLabel: "Clave API de Gemini",
    apiKeyDesc: "Su token de acceso personal",
    apiKeyPlaceholder: "Ingrese su clave API...",
    apiKeyNote: "Su token se almacena localmente y nunca se envía a nuestros servidores.",
    getStarted: "Empezar",
    language: "Idioma",
    theme: "Tema",
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro",
    reputation: "Reputación",
    domainInfo: "Info del Dominio",
    sslSecurity: "Seguridad SSL",
    aiClaims: "Verificación de IA",
    highlyTrusted: "Muy Confiable",
    moderateRisk: "Riesgo Moderado",
    suspicious: "Sospechoso",
    overallScore: "Puntuación de Credibilidad",
    analyzing: "Analizando Credibilidad",
    loadingDesc: "Nuestra IA está escaneando el historial del dominio, certificados SSL y verificando reclamos...",
    backToDashboard: "Volver al Panel",
    metricDetails: "Detalles de la Métrica",
    summary: "Resumen del Análisis",
    findings: "Hallazgos Clave",
    preferences: "Preferencias",
    security: "Seguridad",
    autoScan: "Escaneo Automático",
    clearHistory: "Borrar Historial",
    about: "Acerca de",
    version: "Versión",
    aiModel: "Modelo de IA",
    privacy: "Política de Privacidad",
    poweredBy: "Impulsado por Gemini AI",
    appName: "TrustGuard AI"
  }
};

const SetupScreen = ({ isDarkMode, onComplete, userApiKey, onApiKeyChange, language, onLanguageChange, t }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[60] flex flex-col p-6 overflow-y-auto ${
        isDarkMode ? 'bg-bg-card-dark' : 'bg-bg-card-light'
      }`}
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-emerald-500/20 p-4 rounded-3xl">
            <ShieldCheck className="text-emerald-500" size={48} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t.welcome}</h1>
          <p className={`text-sm max-w-[240px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
            {t.setupDesc}
          </p>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-3">
            <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['en', 'es'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    language === lang
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : (isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-gray-200 text-gray-600')
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Español'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
              {t.apiKeyLabel}
            </label>
            <div className={`p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              <input 
                type="password"
                value={userApiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className={`w-full p-3 rounded-lg text-xs font-mono transition-all outline-none border ${
                  isDarkMode 
                    ? 'bg-black/20 border-white/10 focus:border-emerald-500/50 text-white' 
                    : 'bg-white border-gray-200 focus:border-emerald-500 text-gray-900'
                }`}
              />
              <p className={`text-[9px] leading-relaxed ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
                {t.apiKeyNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onComplete}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {t.getStarted}
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const SettingsPage = ({ isDarkMode, onBack, themeMode, onThemeModeChange, language, onLanguageChange, userApiKey, onApiKeyChange, t }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const SettingItem = ({ icon: Icon, label, description, children }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-white text-gray-500 shadow-sm'}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-sm font-bold">{label}</div>
          <div className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{description}</div>
        </div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ enabled, onChange }) => (
    <button 
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? 'bg-emerald-500' : (isDarkMode ? 'bg-white/10' : 'bg-gray-300')
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-5.5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`flex flex-col h-full w-full ${isDarkMode ? 'bg-bg-card-dark' : 'bg-bg-card-light'}`}
    >
      <div className={`p-4 border-b flex items-center gap-3 transition-colors duration-500 ${
        isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'
      }`}>
        <button 
          onClick={onBack}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-200 text-gray-500'
          }`}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-bold text-lg tracking-tight">{t.settings}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* API Key Section */}
        <div className="space-y-3">
          <h4 className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            AI Configuration
          </h4>
          <div className={`p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-white text-gray-500 shadow-sm'}`}>
                <Key size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">{t.apiKeyLabel}</div>
                <div className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t.apiKeyDesc}</div>
              </div>
            </div>
            <div className="relative">
              <input 
                type={showKey ? "text" : "password"}
                value={userApiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className={`w-full p-3 pr-10 rounded-lg text-xs font-mono transition-all outline-none border ${
                  isDarkMode 
                    ? 'bg-black/20 border-white/10 focus:border-emerald-500/50 text-white' 
                    : 'bg-white border-gray-200 focus:border-emerald-500 text-gray-900'
                }`}
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 transition-colors ${
                  isDarkMode ? 'text-white/30' : 'text-gray-400'
                }`}
              >
                {showKey ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
            <p className={`text-[9px] leading-relaxed ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>
              {t.apiKeyNote}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            {t.preferences}
          </h4>
          
          <SettingItem 
            icon={Languages} 
            label={t.language} 
            description="Choose your preferred language"
          >
            <select 
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={`text-xs font-bold bg-transparent outline-none cursor-pointer ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </SettingItem>

          <div className={`p-4 rounded-xl space-y-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-white text-gray-500 shadow-sm'}`}>
                <Monitor size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">{t.theme}</div>
                <div className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>Appearance preference</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: t.light, icon: Sun },
                { id: 'dark', label: t.dark, icon: Moon },
                { id: 'system', label: t.system, icon: Monitor }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onThemeModeChange(mode.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                    themeMode === mode.id
                      ? 'bg-emerald-500 border-emerald-500 text-black'
                      : (isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-gray-200 text-gray-500')
                  }`}
                >
                  <mode.icon size={14} />
                  <span className="text-[9px] font-bold uppercase">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <SettingItem 
            icon={Bell} 
            label="Notifications" 
            description="Alerts for suspicious sites"
          >
            <Toggle enabled={notifications} onChange={setNotifications} />
          </SettingItem>
        </div>

        <div className="space-y-3">
          <h4 className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            {t.security}
          </h4>
          <SettingItem 
            icon={Shield} 
            label={t.autoScan} 
            description="Scan sites automatically"
          >
            <Toggle enabled={autoScan} onChange={setAutoScan} />
          </SettingItem>
          <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
            isDarkMode ? 'bg-white/5 hover:bg-rose-500/10 text-rose-400' : 'bg-gray-100 hover:bg-rose-50 text-rose-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                <Trash2 size={18} />
              </div>
              <div className="text-sm font-bold">{t.clearHistory}</div>
            </div>
            <ChevronRight size={14} className="opacity-50" />
          </button>
        </div>

        <div className="space-y-3">
          <h4 className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            {t.about}
          </h4>
          <div className={`p-4 rounded-xl space-y-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between text-xs">
              <span className={isDarkMode ? 'text-white/50' : 'text-gray-500'}>{t.version}</span>
              <span className="font-mono font-bold">1.3.0-setup</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={isDarkMode ? 'text-white/50' : 'text-gray-500'}>{t.aiModel}</span>
              <span className="font-mono font-bold">Gemini 3 Flash</span>
            </div>
            <div className="pt-2 border-t border-white/5">
              <button className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                {t.privacy} <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 border-t transition-colors duration-500 ${
        isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'
      }`}>
        <div className="text-center text-[10px] text-white/20">
          TrustGuard AI &copy; 2026
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('trustguard_theme_mode') || 'system');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem('trustguard_language') || 'en');
  const [hasCompletedSetup, setHasCompletedSetup] = useState(() => localStorage.getItem('trustguard_setup_complete') === 'true');
  const [view, setView] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('trustguard_api_key') || '');
  const currentUrl = "https://example.com";

  const t = translations[language];

  // Handle Theme Logic
  useEffect(() => {
    localStorage.setItem('trustguard_theme_mode', themeMode);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    if (themeMode === 'system') {
      setIsDarkMode(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
    } else {
      setIsDarkMode(themeMode === 'dark');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('trustguard_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('trustguard_api_key', userApiKey);
  }, [userApiKey]);

  useEffect(() => {
    localStorage.setItem('trustguard_setup_complete', hasCompletedSetup);
  }, [hasCompletedSetup]);

  const performAnalysis = async (targetUrl) => {
    if (!hasCompletedSetup) return;
    
    setIsAnalyzing(true);
    // Artificial delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockTechnical = {
      reputation: Math.floor(Math.random() * 40) + 60,
      domain: Math.floor(Math.random() * 30) + 70,
      ssl: 100,
      details: {
        reputationText: "Domain has been active for 5+ years with no major security reports. Historical data suggests high reliability and consistent uptime.",
        domainText: "Registered with a reputable registrar. No suspicious TLD. WHOIS data is transparent and verified.",
        sslText: "Valid SSL certificate issued by Let's Encrypt. TLS 1.3 enabled. Strong cipher suites detected with no known vulnerabilities.",
      }
    };

    const aiResult = await analyzeWebsiteClaims(targetUrl, "Sample content for analysis.", userApiKey);
    const overall = Math.round((mockTechnical.reputation + mockTechnical.domain + mockTechnical.ssl + aiResult.score) / 4);

    setMetrics({
      ...mockTechnical,
      aiClaims: aiResult.score,
      overallScore: overall,
      details: {
        ...mockTechnical.details,
        aiAnalysis: aiResult.reasoning
      }
    });

    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (hasCompletedSetup) {
      performAnalysis(currentUrl);
    }
  }, [hasCompletedSetup]);

  const metricList = [
    { id: 0, label: t.reputation, icon: Globe, score: metrics?.reputation ?? 0, details: metrics?.details.reputationText ?? "" },
    { id: 1, label: t.domainInfo, icon: Search, score: metrics?.domain ?? 0, details: metrics?.details.domainText ?? "" },
    { id: 2, label: t.sslSecurity, icon: Lock, score: metrics?.ssl ?? 0, details: metrics?.details.sslText ?? "" },
    { id: 3, label: t.aiClaims, icon: Brain, score: metrics?.aiClaims ?? 0, details: metrics?.details.aiAnalysis ?? "" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-bg-main-dark text-white' : 'bg-bg-main-light text-gray-900'
    }`}>
      <div className={`w-[380px] h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border transition-colors duration-500 relative ${
        isDarkMode ? 'bg-bg-card-dark border-white/10' : 'bg-bg-card-light border-gray-200'
      }`}>
        <AnimatePresence mode="wait">
          {!hasCompletedSetup && (
            <SetupScreen 
              isDarkMode={isDarkMode}
              language={language}
              onLanguageChange={setLanguage}
              userApiKey={userApiKey}
              onApiKeyChange={setUserApiKey}
              onComplete={() => setHasCompletedSetup(true)}
              t={t}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isAnalyzing && hasCompletedSetup && <LoadingScreen isDarkMode={isDarkMode} t={t} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`flex flex-col h-full w-full ${isDarkMode ? 'bg-bg-card-dark' : 'bg-bg-card-light'}`}
            >
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between transition-colors duration-500 ${
                isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                    <ShieldCheck className="text-emerald-500" size={20} />
                  </div>
                  <h1 className="font-bold text-lg tracking-tight">{t.appName}</h1>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setView('settings')}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => performAnalysis(currentUrl)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-white/5 text-white/60' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <RefreshCw size={18} className={isAnalyzing ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
                <div className="flex flex-col items-center py-4">
                  <div className={`relative ${metrics?.overallScore && metrics.overallScore >= 80 ? 'animate-glow' : ''}`}>
                    <ScoreCircle score={metrics?.overallScore ?? 0} isDarkMode={isDarkMode} />
                    {metrics && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-black p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <ShieldCheck size={16} />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">
                      {metrics?.overallScore && metrics.overallScore >= 80 ? t.highlyTrusted : 
                       metrics?.overallScore && metrics.overallScore >= 50 ? t.moderateRisk : t.suspicious}
                    </h2>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{t.overallScore}</p>
                    <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-medium border inline-block ${
                      isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-gray-100 border-gray-200 text-gray-500'
                    }`}>
                      {currentUrl}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {metricList.map((m, index) => (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <MetricCard 
                        icon={m.icon} 
                        label={m.label} 
                        score={m.score}
                        description={m.details}
                        isDarkMode={isDarkMode}
                        onClick={() => {
                          setSelectedMetric(m.id);
                          setView('detail');
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className={`p-3 border-t flex items-center justify-center gap-4 transition-colors duration-500 ${
                isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'
              }`}>
                <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold ${
                  isDarkMode ? 'text-white/30' : 'text-gray-400'
                }`}>
                  <Info size={10} />
                  {t.poweredBy}
                </div>
              </div>
            </motion.div>
          ) : view === 'detail' ? (
            <DetailPage 
              key="detail"
              metric={metricList[selectedMetric ?? 0]} 
              isDarkMode={isDarkMode} 
              onBack={() => setView('dashboard')} 
              t={t}
            />
          ) : (
            <SettingsPage 
              key="settings"
              isDarkMode={isDarkMode}
              onBack={() => setView('dashboard')}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              language={language}
              onLanguageChange={setLanguage}
              userApiKey={userApiKey}
              onApiKeyChange={setUserApiKey}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
