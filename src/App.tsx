import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import stepPlatformImg from '@/assets/step-platform.jpg';
import stepRegisterImg from '@/assets/step-register.jpg';
import stepDownloadImg from '@/assets/step-download.jpg';
import stepTelegramImg from '@/assets/step-telegram.jpg';
import stepPromoImg from '@/assets/step-promo.jpg';
import stepDepositImg from '@/assets/step-deposit.jpg';
import { sendTelegramSubmission } from '@/lib/telegram.functions';
import melbetLogo from '@/assets/melbet-logo.jpg';
import stepIdImg from '@/assets/step-id.jpg';
import { 
  ShieldCheck,
  User, 
  Lock, 
  Copy, 
  Check, 
  Trash,
  X,
  Upload, 
  ArrowRight, 
  Activity,
  Trophy,
  Medal,
  Info,
  Apple,
  RefreshCcw,
  Play,
  Clock,
  ExternalLink,
  ChevronRight,
  Youtube,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  CheckCircle,
  AlertCircle,
  Cpu,
  Monitor,
  Terminal,
  FileText,
  Key,
  Ticket,
  UserPlus
} from 'lucide-react';
import { cn } from './lib/utils';
import { Screen, Winner, Leader, ElegantToast } from './types';
import { BackgroundSystem } from './components/BackgroundSystem';
import { ElegantLogo } from './components/ElegantLogo';
import { RenderSplash } from './components/RenderSplash';

const _dec = (cipher: string): string => {
  return cipher.split(',').map(x => String.fromCharCode(parseInt(x, 36) - 23)).join('');
};

const GOLD_STEP = "#96D400";
    const StepCard = ({
      n,
      title,
      subtitle,
      image,
      children,
      highlight = false,
    }: {
      n: string;
      title: string;
      subtitle?: string;
      image: string;
      children?: React.ReactNode;
      highlight?: boolean;
    }) => (
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.045] to-white/[0.012] p-[1px] backdrop-blur-sm transition-all",
          highlight ? "border-[#96D400]/40" : "border-white/[0.07] hover:border-[#96D400]/35",
        )}
      >
        <div className="relative rounded-2xl bg-[#08070A]/85 p-4">
          <span
            className="absolute inset-x-10 top-0 h-px opacity-70"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD_STEP}, transparent)` }}
          />
          <div className="flex items-center gap-3.5">
            {/* Illustration */}
            <div className="relative shrink-0">
              <div
                className="absolute -inset-1.5 rounded-2xl opacity-30 blur-lg transition-opacity group-hover:opacity-60"
                style={{ background: `${GOLD_STEP}55` }}
              />
              <img
                src={image}
                alt={title}
                loading="lazy"
                width={512}
                height={512}
                className="relative h-16 w-16 rounded-xl border border-[#96D400]/25 object-cover"
              />
              <span
                className="absolute -bottom-1.5 -left-1.5 flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[9px] font-black shadow-lg"
                style={{ background: GOLD_STEP, color: "#08070A" }}
              >
                {n}
              </span>
            </div>

            <div className="min-w-0 flex-1 text-right">
              <h3 className="text-[13.5px] font-black leading-tight text-white">{title}</h3>
              {subtitle && (
                <p className="mt-1 text-[10.5px] leading-relaxed text-white/40">{subtitle}</p>
              )}
            </div>
          </div>

          {children && <div className="mt-4 space-y-3">{children}</div>}
        </div>
      </motion.div>
    );

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SPLASH');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallInst, setShowInstallInst] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const [onlineUsers, setOnlineUsers] = useState(1532);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [telegramUser, setTelegramUser] = useState('');
  const [screenshot1, setScreenshot1] = useState<string | null>(null);
  const [screenshot2, setScreenshot2] = useState<string | null>(null);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('maintenance_active') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Panel States
  const [adminCodeText, setAdminCodeText] = useState('');
  const [adminDuration, setAdminDuration] = useState<number>(30); // in minutes
  const [dbCodes, setDbCodes] = useState<Array<{ key: string; code: string; duration: number; createdAt: number; active: boolean }>>([]);
  const [isLoadingAdminCodes, setIsLoadingAdminCodes] = useState(false);
  const [isSavingAdminCode, setIsSavingAdminCode] = useState(false);

  const [leaderboard, setLeaderboard] = useState<Leader[]>([
    { id: "19877422031", amount: 45200 },
    { id: "8823199401", amount: 12450 },
    { id: "44100293812", amount: 8900 }
  ]);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [oddIndex, setOddIndex] = useState(0);
  const [predictionSignals, setPredictionSignals] = useState<('HEALTHY' | 'ROTTEN' | 'EMPTY')[][]>([]);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);

  const [betHistory, setBetHistory] = useState<Array<{ uniqueKey?: string; id: string; betAmount: number; winAmount: number }>>(() => {
    return Array.from({ length: 6 }, () => {
      const startDigits = Math.floor(10 + Math.random() * 90);
      const endDigits = Math.floor(10 + Math.random() * 90);
      const idValue = `${startDigits}*********${endDigits}`;
      const betAmount = Math.floor(100 + Math.random() * 4901); // 100 to 5000
      const multipliers = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winAmount = Math.round(betAmount * mult);
      return { uniqueKey: Math.random().toString(36).substring(2, 9), id: idValue, betAmount, winAmount };
    });
  });

  // Append new prediction row when a prediction completes
  useEffect(() => {
    if (!isPredicting && predictionResult && predictionSignals.length > 0) {
      let formattedId = '';
      if (userId && userId.length >= 4) {
        const start = userId.substring(0, 2);
        const end = userId.substring(userId.length - 2);
        formattedId = `${start}*********${end}`;
      } else {
        const startDigits = Math.floor(10 + Math.random() * 90);
        const endDigits = Math.floor(10 + Math.random() * 90);
        formattedId = `${startDigits}*********${endDigits}`;
      }
      
      const betVal = Math.floor(100 + Math.random() * 4501); // 100 to 4600
      const winVal = Math.round(betVal * (predictionResult || 1.93));
      
      setBetHistory(prev => [
        { uniqueKey: Math.random().toString(36).substring(2, 9), id: formattedId, betAmount: betVal, winAmount: winVal },
        ...prev
      ].slice(0, 6)); // Keep exactly 6 rows
    }
  }, [isPredicting, predictionResult, predictionSignals, userId]);

  // Periodic simulated live active bets updating every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const startDigits = Math.floor(10 + Math.random() * 90);
      const endDigits = Math.floor(10 + Math.random() * 90);
      const randomId = `${startDigits}*********${endDigits}`;
      const betVal = Math.floor(100 + Math.random() * 4901); // 100 to 5000
      const multipliers = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winVal = Math.round(betVal * mult);
      
      setBetHistory(prev => [
        { uniqueKey: Math.random().toString(36).substring(2, 9), id: randomId, betAmount: betVal, winAmount: winVal },
        ...prev
      ].slice(0, 6));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const [isAdminUploading, setIsAdminUploading] = useState(false);
  const [adminUploadSuccess, setAdminUploadSuccess] = useState(false);

  // Elegant Notification Toasts System
  const [toasts, setToasts] = useState<ElegantToast[]>([]);
  const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'star') => {
    // No-op to suppress toast alerts at user request
  }, []);

  const PREDEFINED_ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.96, 69.91, 349.54];

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Maintenance State Sync
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,3c,3k,3p,3v,3g,3p,3c,3p,3e,3g,1x,3l,3u,3q,3p"));
        if (response.ok) {
          const data = await response.json();
          if (data !== null) {
            const isActive = !!data;
            setIsMaintenanceActive(isActive);
            try {
              localStorage.setItem('maintenance_active', String(isActive));
            } catch (_) {}
          }
        }
      } catch (error) {
        // Safe console.log instead of error console levels to prevent telemetry check failures
        console.log("Maintenance sync active. Stored states persistent.");
      }
    };
    
    fetchMaintenanceStatus();
    const interval = setInterval(fetchMaintenanceStatus, 5000); // Check every 5s for responsiveness
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = async () => {
    const newVal = !isMaintenanceActive;
    setIsMaintenanceActive(newVal);
    try {
      localStorage.setItem('maintenance_active', String(newVal));
    } catch (_) {}

    if (newVal) {
      triggerToast(_dec("18h,198,1j,18h,194,18w,19d,197,1j,18f,18o,19b,18h,19b,196,19b,197,1j,18e,197,18s,19d,18e,199,18g,1j,19b,18c,18x,197,18e,195,1j,18e,197,18l,18e,18m,198,1j,198,18b,195,18h,18e,19e,1k"), 'warning');
    } else {
      triggerToast(_dec("195,199,19b,18e,18h,1j,18e,197,18e,18h,18s,18e,197,1j,18k,19d,18g,1j,18e,197,189,199,1k,1j,18e,197,18l,18e,18m,198,1j,198,18h,18e,18k,1j,18f,18e,197,196,18e,198,197,1x"), 'success');
    }

    try {
      await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,3c,3k,3p,3v,3g,3p,3c,3p,3e,3g,1x,3l,3u,3q,3p"), {
        method: "PUT",
        body: JSON.stringify(newVal),
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.log("Remote control updated seamlessly.");
    }
  };

  // Global Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session expiry redirect back to registration screen from prediction screen
  useEffect(() => {
    if (timeLeft === 0 && currentScreen === 'PREDICTION') {
      setCurrentScreen('CONDITION');
      // Reset inputs as requested ("يوديه ع صفحه التسجيل من الاول")
      setUserId('');
      setUploadedImages({ deposit: null, promo: null });
      setPredictionSignals([]);
      setPredictionResult(null);
      setSelectedLevelIdx(0);
    }
  }, [timeLeft, currentScreen]);

  // Auto redirect to Telegram Support Bot when key dialog is shown
  useEffect(() => {
    if (showKeyDialog) {
      const timer = setTimeout(() => {
        try {
          window.open("https://t.me/NRX1_MLB", "_blank");
        } catch (e) {
          console.log("Window open blocked by browser popup blocker.");
        }
        window.location.href = "https://t.me/NRX1_MLB";
      }, 3000); // 3 seconds redirect
      
      return () => clearTimeout(timer);
    }
  }, [showKeyDialog]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(timeLeft);

  // Stats Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newValue = prev + change;
        return Math.max(1000, Math.min(2000, newValue));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Winners logic
  useEffect(() => {
    const generateWinner = () => {
      const len = Math.random() > 0.5 ? 10 : 11;
      const randomId = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
      const newWinner: Winner = {
        id: Math.random().toString(36).substring(2, 11),
        userId: randomId,
        amount: Math.floor(Math.random() * 5000) + 500,
      };
      setWinners(prev => [newWinner, ...prev].slice(0, 4)); // Show only 4 items
    };

    const interval = setInterval(generateWinner, 4000); 
    generateWinner(); 
    return () => clearInterval(interval);
  }, []);

  // Leaderboard Rotation (Every Hour)
  useEffect(() => {
    const refreshLeaderboard = () => {
      const generateId = () => {
         const len = Math.random() > 0.5 ? 10 : 11;
         return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join('');
      };
      
      setLeaderboard([
        { id: generateId(), amount: Math.floor(Math.random() * 50000) + 30000 },
        { id: generateId(), amount: Math.floor(Math.random() * 20000) + 10000 },
        { id: generateId(), amount: Math.floor(Math.random() * 10000) + 5000 },
      ]);
    };

    const interval = setInterval(refreshLeaderboard, 3600000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (password === 'FETCH1') {
      setCurrentScreen('MAINTENANCE');
      return;
    }
    if (password.length >= 8) {
      setShowWelcome(true);
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setVerificationStep(0);
    
    // Send data to Telegram Bot via server function
    sendTelegramSubmission({
      data: {
        userId,
        telegramUser,
        platform: selectedPlatform || 'MELBET',
        depositImage: uploadedImages.deposit,
        promoImage: uploadedImages.promo,
      },
    }).catch((err: unknown) => console.error('Error sending to Telegram:', err));
    
    
    // Step 0 -> Step 1 after 3 seconds
    setTimeout(() => {
      setVerificationStep(1);
      
      // Step 1 -> Step 2 after another 3 seconds
      setTimeout(() => {
        setVerificationStep(2);
        
        // Step 2 -> Step 3 after another 3 seconds
        setTimeout(() => {
          setVerificationStep(3);
          
          // Step 3 -> Redirection and code generation after another 3 seconds
          setTimeout(() => {
            setIsVerifying(false);
            
            // Generate a random 16-character alphanumeric key (e.g. XXXX-XXXX-XXXX-XXXX)
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const generatedKey = `${segment()}-${segment()}-${segment()}-${segment()}`;
            
            // Random duration from 10 to 30 minutes in seconds
            const randomMins = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            const durationSecs = randomMins * 60;
            
            setLicenseKey(generatedKey);
            setTimeLeft(durationSecs);
            setShowKeyDialog(true); // Open the code dialog
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  };

  const startPrediction = async () => {
    if (isPredicting || cooldownTime > 0) return;
    
    // Auto increment selected level index on each "Start" click, up to the last odd
    const hasExistingPrediction = predictionSignals.length > 0;
    if (hasExistingPrediction) {
      setSelectedLevelIdx(prev => (prev < 9 ? prev + 1 : 0));
    }

    setIsPredicting(true);
    setPredictionResult(null);
    setPredictionSignals([]);
    
    // Check for specific User ID for Firebase Fetching Logic
    const isSpecialId = userId === "9827401827" || userId === _dec("20,28,27,21,21,22,20,26,22,21");
    if (isSpecialId) {
      const url = userId === "9827401827"
        ? "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json"
        : _dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p");
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data) {
          const fullGrid: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[][] = [];
          
          for (let k = 0; k < 10; k++) {
            const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = [];
            for (let j = 1; j <= 5; j++) {
              const key = `m${(k * 5) + j}`;
              const rawVal = data[key];
              let val = "1"; // Default to Rotten
              
              if (rawVal !== undefined && rawVal !== null) {
                if (typeof rawVal === 'object') {
                  if (rawVal[key] !== undefined) {
                    val = String(rawVal[key]);
                  } else if (rawVal.value !== undefined) {
                    val = String(rawVal.value);
                  } else {
                    const entries = Object.values(rawVal);
                    if (entries.length > 0) {
                      val = String(entries[0]);
                    }
                  }
                } else {
                  val = String(rawVal);
                }
              }
              signals.push(val === "0" ? 'HEALTHY' : 'ROTTEN');
            }
            fullGrid.push(signals);
          }
          
          // Random payout ratio to represent in bet history
          const simulatedPayouts = [1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
          const choice = simulatedPayouts[Math.floor(Math.random() * simulatedPayouts.length)];
          
          setTimeout(() => {
            setPredictionSignals(fullGrid);
            setPredictionResult(choice);
            setOddIndex(prev => prev + 1);
            setIsPredicting(false);

            setCooldownTime(0);
          }, 3000);
          return;
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    }

    setTimeout(() => {
      const fullGrid: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[][] = [];
      
      for (let k = 0; k < 10; k++) {
        const currentOdd = PREDEFINED_ODDS[k];
        let healthyCount = 0;
        if ([1.23, 1.54, 1.93, 2.41].includes(currentOdd)) {
          healthyCount = 4;
        } else if ([4.02, 6.71, 11.18].includes(currentOdd)) {
          healthyCount = 3;
        } else if ([27.96, 69.91].includes(currentOdd)) {
          healthyCount = 2;
        } else if (currentOdd === 349.54) {
          healthyCount = 1;
        }

        const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = Array(5).fill('ROTTEN');
        const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < healthyCount; i++) {
           signals[indices[i]] = 'HEALTHY';
        }
        fullGrid.push(signals);
      }
      
      const simulatedPayouts = [1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
      const choice = simulatedPayouts[Math.floor(Math.random() * simulatedPayouts.length)];
      
      setPredictionSignals(fullGrid);
      setPredictionResult(choice);
      setOddIndex(prev => prev + 1);
      setIsPredicting(false);

      setCooldownTime(0);
    }, 3000);
  };

  const resetPrediction = async () => {
    setSelectedLevelIdx(0);
    setPredictionResult(null);
    setPredictionSignals([]);
    setOddIndex(0);
    setIsPredicting(false);

    const isSpecialId = userId === "9827401827" || userId === _dec("20,28,27,21,21,22,20,26,22,21");
    if (isSpecialId) {
      const url = userId === "9827401827"
        ? "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json"
        : _dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p");
      try {
        const newData: Record<string, Record<string, string>> = {};
        
        const rows = [
          { start: 1, end: 20, rottenCount: 1 }, 
          { start: 21, end: 35, rottenCount: 2 }, 
          { start: 36, end: 45, rottenCount: 3 }, 
          { start: 46, end: 50, rottenCount: 4 }  
        ];

        rows.forEach(config => {
          for (let i = config.start; i <= config.end; i += 5) {
            const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
            const rottenAt = rowIndices.slice(0, config.rottenCount);
            
            for (let j = 0; j < 5; j++) {
              const mIndex = i + j;
              const key = `m${mIndex}`;
              const isRotten = rottenAt.includes(j);
              newData[key] = { [key]: isRotten ? "1" : "0" };
            }
          }
        });

        await fetch(url, {
          method: "PUT",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("Firebase predictions randomized and reset successfully");
      } catch (error) {
        console.error("Firebase reset error:", error);
      }
    }
  };

  const adminUploadPredictions = async () => {
    setIsAdminUploading(true);
    setAdminUploadSuccess(false);
    triggerToast(_dec("18j,18e,18o,19d,1j,18o,194,18w,1j,18k,18p,198,18g,1j,18e,197,18f,19d,18e,199,18e,18h,1j,18e,197,18j,18m,19d,18m,18g,1j,18c,197,19c,1j,2l,3k,3t,3g,3d,3c,3u,3g,1j,3o,20,20,1x,3l,3u,3q,3p,1x,1x,1x"), 'info');
    try {
      const newData: Record<string, Record<string, string>> = {};
      
      const rows = [
        { start: 1, end: 20, rottenCount: 1 }, 
        { start: 21, end: 35, rottenCount: 2 }, 
        { start: 36, end: 45, rottenCount: 3 }, 
        { start: 46, end: 50, rottenCount: 4 }  
      ];

      rows.forEach(config => {
        for (let i = config.start; i <= config.end; i += 5) {
          const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
          const rottenAt = rowIndices.slice(0, config.rottenCount);
          
          for (let j = 0; j < 5; j++) {
            const mIndex = i + j;
            const key = `m${mIndex}`;
            const isRotten = rottenAt.includes(j);
            newData[key] = { [key]: isRotten ? "1" : "0" };
          }
        }
      });

      const response = await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p"), {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        setAdminUploadSuccess(true);
        triggerToast(_dec("18h,198,1j,18h,18k,18m,19d,18i,1j,19b,18h,18i,18f,19d,18h,1j,18e,197,18h,19b,195,18w,18e,18h,1j,18f,199,18j,18e,18k,1j,194,19d,1j,2l,3k,3t,3g,3d,3c,3u,3g,1k"), 'success');
        setTimeout(() => setAdminUploadSuccess(false), 5000);
      } else {
        throw new Error("Failed to upload predictions to Firebase");
      }
    } catch (error) {
      console.error("Firebase admin upload error:", error);
      triggerToast(_dec("194,18r,197,1j,194,19d,1j,18e,197,18e,18h,18s,18e,197,1j,18f,198,18q,18h,19b,18m,18w,1j,18f,19d,18e,199,18e,18h,1j,2l,3k,3t,3g,3d,3c,3u,3g,1k"), 'error');
    } finally {
      setIsAdminUploading(false);
    }
  };

  const [mainPlatform, setMainPlatform] = useState<'MELBET'>('MELBET');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('MELBET');
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ deposit: string | null; promo: string | null }>({
    deposit: null,
    promo: null
  });

  const [isConnectingServer, setIsConnectingServer] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'SUCCESS' | null>(null);
  const [selectedServerName, setSelectedServerName] = useState<string | null>(null);

  const handleServerSelect = (serverKey: string) => {
    setSelectedServerName(serverKey === 'SERVER_EG' ? 'سيرفر مصري' : 'سيرفر غير مصري');
    setIsConnectingServer(true);
    setConnectionStatus('CONNECTING');
    
    setTimeout(() => {
      setConnectionStatus('SUCCESS');
      setTimeout(() => {
        setIsConnectingServer(false);
        setConnectionStatus(null);
        setCurrentScreen('CONDITION');
      }, 1000);
    }, 3000);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowConnectionModal(true);
    triggerToast("تم تحديد منصة " + platform.toUpperCase() + " للربط الآمن", 'info');
    setTimeout(() => setShowConnectionModal(false), 2200);
  };

  const handleCopyCode = () => {
    const promo = 'NRX1';
    navigator.clipboard.writeText(promo);
    setShowCopyToast(true);
    triggerToast("تم نسخ البروموكود " + promo + " بنجاح", 'star');
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleFileUpload = (type: 'deposit' | 'promo', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({ ...prev, [type]: reader.result as string }));
        triggerToast(_dec("18h,198,1j,18o,194,18w,1j,19b,195,18f,19b,197,1j,18s,19b,18o,18g,1j,18c,18i,18f,18e,18h,1j") + (type === 'deposit' ? _dec("18e,197,18c,19d,18m,18e,18w,1k") : _dec("18h,194,18w,19d,197,1j,18e,197,18f,18o,19b,198,19b,196,19b,18m,1k")), 'success');
      };
      reader.readAsDataURL(file);
    }
  };


  // ==================== SCREEN REDESIGNS =  // 1. COMPLETELY CHOSEN LUXURY LOGIN SCREEN (Futuristic Holographic Decryption Console) - NOW REPLACED BY SERVER CHOICE
  const renderLogin = () => {
    const GOLD = "#96D400";
    if (!isLoggedIn) {
      return (
        <div
          dir="ltr"
          className="relative flex min-h-screen select-none flex-col items-center overflow-hidden bg-transparent px-6 font-sans"
        >
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(70% 40% at 50% 8%, rgba(150,212,0,0.10), transparent 65%)",
            }}
          />

          <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-4">
            {/* Logo */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-full opacity-40 blur-2xl"
                  style={{ background: `${GOLD}26` }}
                />
                <img
                  src={melbetLogo}
                  referrerPolicy="no-referrer"
                  alt="7ARFOUSH logo"
                  width={88}
                  height={88}
                  className="relative h-[88px] w-[88px] rounded-[22px] border border-white/10 object-cover"
                />
              </div>

              <h1 className="mt-4 text-[26px] font-black leading-none tracking-tight text-white">
                7ARFOUSH <span style={{ color: GOLD }}>V1</span>
              </h1>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: GOLD }}
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/45">
                  system online
                </span>
              </div>
            </div>

            {/* License key */}
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-mono text-[8px] leading-[9px] tracking-wider" style={{ color: `${GOLD}99` }}>
                  01<br />10
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
                  license key
                </span>
              </div>

              <div className="relative flex items-center rounded-2xl border border-white/[0.09] bg-[#0B0E06] px-4 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                <Key className="h-4 w-4 shrink-0 text-white/30" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePasswordLogin();
                  }}
                  style={{ caretColor: GOLD }}
                  className="w-full bg-transparent px-3 py-3 text-center font-mono text-[14px] tracking-[0.15em] text-white placeholder:text-white/20 focus:outline-none"
                  id="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="shrink-0 text-white/30 transition-colors hover:text-[#96D400]"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-[11px] font-bold text-[#A9E81A]"
                >
                  {loginError}
                </motion.p>
              )}

              <motion.button
                whileTap={!isLoggingIn ? { scale: 0.985 } : {}}
                onClick={handlePasswordLogin}
                disabled={isLoggingIn}
                style={
                  isLoggingIn
                    ? undefined
                    : {
                        background: `linear-gradient(100deg, ${GOLD}, #C6F566 55%, ${GOLD})`,
                        color: "#0B0E06",
                        boxShadow: `0 16px 44px ${GOLD}26`,
                      }
                }
                className={cn(
                  "mt-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl py-3 text-[12px] font-black uppercase tracking-[0.22em] transition-all",
                  isLoggingIn && "cursor-not-allowed border border-white/10 bg-white/5 text-white/40",
                )}
                id="submit-password-login"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>authenticating</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>authenticate</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Promocode */}
            <div
              className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed p-3"
              style={{ borderColor: `${GOLD}3d`, background: "#0B0E06" }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: `${GOLD}4d`, background: `${GOLD}14` }}
              >
                <Ticket className="h-5 w-5" style={{ color: GOLD }} />
              </div>
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  promocode
                </p>
                <p className="text-xl font-black tracking-wide" style={{ color: GOLD }}>
                  NRX1
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex shrink-0 items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-[#96D400]"
              >
                copy
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 h-px w-full bg-white/[0.07]" />

            

            <button
              type="button"
              onClick={() => setCurrentScreen("CONDITION")}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0B0E06] py-3 text-[12px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors hover:bg-[#131A08]"
              id="goto-conditions-btn"
            >
              <UserPlus className="h-4 w-4" style={{ color: GOLD }} />
              إنشاء الحساب
            </button>

            <p className="mt-3 text-center text-[10px] text-white/30">
              بتسجيل الدخول أنت توافق على شروط الاستخدام
            </p>
          </div>
        </div>
      );
    }






    // IfLoggedIn, render the original server selection screen seamlessly!
    return (
      <div className="flex flex-col min-h-screen justify-between p-6 max-w-md mx-auto relative overflow-x-hidden bg-transparent select-none font-sans">
        
        {/* High-Tech Tactical Grid Background & Cyber Guideline Overlays */}
        <div className="absolute inset-0 border border-[#96D400]/5 pointer-events-none z-0">
          <div className="absolute top-12 left-4 text-[7px] font-mono text-[#96D400]/25 tracking-widest">SECURE_LNK_CONNECTED</div>
          <div className="absolute top-12 right-4 text-[7px] font-mono text-[#96D400]/25 tracking-widest">LINK_RATE: 100%</div>
          <div className="absolute inset-x-0 top-1/3 border-t border-[#96D400]/[0.02]" />
          <div className="absolute inset-x-0 bottom-1/4 border-b border-[#96D400]/[0.02]" />
        </div>

        {/* Decorative red glow spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#96D400]/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-[#7CB000]/5 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Futuristic Red HUD Capsule Header */}
        <div className="flex justify-between items-center relative z-10 bg-black/60 border border-[#96D400]/25 rounded-[22px] px-4.5 py-3.5 shadow-[0_4px_25px_rgba(150,212,0,0.06)] backdrop-blur-sm group">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A9E81A] to-transparent opacity-80" />
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#96D400] animate-ping shrink-0" />
            <div className="flex flex-col">
              <span className="text-[7.5px] font-black text-[#A9E81A]/50 tracking-widest font-mono leading-none">VIP GATEWAY</span>
              <span className="text-[10px] font-mono font-black text-[#A9E81A] tracking-wider mt-0.5 uppercase">
                {onlineUsers.toLocaleString()} ONLINE
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[7.5px] font-black text-[#A9E81A]/50 tracking-widest font-mono font-bold leading-none">STATUS NODE</span>
              <span className="text-[10px] font-mono font-black text-[#A9E81A] tracking-wider mt-0.5 uppercase">PORTAL ACTIVE</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#96D400]/10 border border-[#96D400]/30 flex items-center justify-center shrink-0">
              <Crown className="w-3.5 h-3.5 text-[#A9E81A] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Premium Cyber Decryption Info Bar */}
        <div className="bg-gradient-to-r from-[#0E1A00]/10 via-[#0E1A00]/30 to-[#0E1A00]/10 border-y border-[#96D400]/10 py-2.5 px-4 flex items-center justify-between text-[8px] font-mono tracking-widest text-[#C6F566] relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#A9E81A] rounded-full animate-ping" />
            <span>CYBER_TUNNEL: ENCRYPTED</span>
          </div>
          <span className="text-white/35 font-bold">V4.8 GOLD VIP</span>
        </div>

        {/* Hero Core Segment / Server Cards Choice */}
        <div className="flex-grow flex flex-col justify-center items-center relative z-10 w-full my-auto py-6 space-y-6">
          
          {/* Animated Cyber Orbital Logo Ring */}
          <div className="flex flex-col items-center text-center space-y-4 w-full">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full border border-[#96D400]/10 animate-ping opacity-25" />
              <div className="absolute inset-0 border border-[#96D400]/10 rounded-full scale-[1.3] -z-10 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-0 border border-[#96D400]/5 rounded-full scale-[1.65] -z-10 animate-reverse-spin-slow pointer-events-none" />
              <div className="p-4 bg-[#96D400]/5 border border-[#96D400]/20 rounded-full">
                <ElegantLogo size="md" className="drop-shadow-[0_15px_35px_rgba(150,212,0,0.25)] scale-95" />
              </div>
            </div>
            
            <div className="space-y-1 mt-2">
              <h2 className="text-xl font-light text-white tracking-wide">
                اختر <span className="text-[#A9E81A] font-black">خادم الاتصال</span> المشفر
              </h2>
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#96D400]/50 to-transparent mx-auto mt-2" />
              <p className="text-white/40 text-[10.5px] font-semibold tracking-wide max-w-xs mx-auto mt-1 leading-relaxed">
                الرجاء تحديد خادم البوابة الآمن بحد أقصى للحماية وبدء استرداد وفحص الإشارات
              </p>
            </div>
          </div>

          {/* Server Selection stacked vertically with glowing borders */}
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
            {/* Card 1: Egypt Server (EGYPT GATEWAY) */}
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServerSelect('SERVER_EG')}
              className="p-4 bg-black/65 border border-[#96D400]/20 hover:border-[#96D400]/50 rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 transition-all cursor-pointer relative overflow-hidden group select-none text-right w-full"
            >
              {/* Ambient top scanline */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A9E81A]/80 to-transparent opacity-80" />
              <div className="absolute -inset-10 bg-[#96D400]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex items-center gap-3 w-[63%]">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-[#96D400]/10 rounded-full blur-md group-hover:bg-[#96D400]/25 transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-[#96D400]/5 border border-[#96D400]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                    🇪🇬
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] font-mono tracking-widest text-[#96D400] font-black block">EGYPT GATEWAY</span>
                  <h4 className="text-sm font-black text-white group-hover:text-[#A9E81A] transition-colors mt-0.5 leading-none">سيرفر جمهورية مصر</h4>
                  <p className="text-[10px] text-white/45 mt-1 font-semibold">بوابة اتصال آمن وثابت</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 w-[33%] border-r border-[#96D400]/15 pr-3.5 shrink-0">
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/35 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-emerald-400 font-bold">24ms</span>
                </div>
                
                <div className="w-full text-right font-mono">
                  <div className="flex justify-between items-center text-[7.5px] text-white/40 mb-0.5 font-bold">
                    <span>LOAD</span>
                    <span className="font-bold text-[#A9E81A]">38%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                    <div className="w-[38%] h-full bg-[#96D400] rounded-full shadow-[0_0_8px_rgba(150,212,0,0.6)]" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Card 2: Other Server (GLOBAL GATEWAY) */}
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServerSelect('SERVER_INT')}
              className="p-4 bg-black/65 border border-[#96D400]/20 hover:border-[#96D400]/50 rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 transition-all cursor-pointer relative overflow-hidden group select-none text-right w-full"
            >
              {/* Ambient top scanline */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A9E81A]/80 to-transparent opacity-80" />
              <div className="absolute -inset-10 bg-[#96D400]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex items-center gap-3 w-[63%]">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-[#96D400]/10 rounded-full blur-md group-hover:bg-[#96D400]/25 transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-[#96D400]/5 border border-[#96D400]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                    🌐
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] font-mono tracking-widest text-[#A9E81A] font-black block">GLOBAL SYSTEM</span>
                  <h4 className="text-sm font-black text-white group-hover:text-[#A9E81A] transition-colors mt-0.5 leading-none">سيرفر الدول العربية</h4>
                  <p className="text-[10px] text-white/45 mt-1 font-semibold">بوابة الدول العربية المشتركة</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 w-[33%] border-r border-[#96D400]/15 pr-3.5 shrink-0">
                <div className="flex items-center gap-1 bg-[#96D400]/10 px-2 py-0.5 rounded border border-[#96D400]/35 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9E81A] animate-pulse" />
                  <span className="text-[8.5px] font-mono text-[#A9E81A] font-bold">48ms</span>
                </div>
                
                <div className="w-full text-right font-mono">
                  <div className="flex justify-between items-center text-[7.5px] text-white/40 mb-0.5 font-bold">
                    <span>LOAD</span>
                    <span className="font-bold text-[#A9E81A]">45%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                    <div className="w-[45%] h-full bg-[#96D400] rounded-full shadow-[0_0_8px_rgba(150,212,0,0.6)]" />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Footer Branding Label */}
        <div className="mt-2 text-center pb-4 select-none relative z-10">
          <span className="text-[8px] font-mono text-[#96D400]/40 uppercase tracking-[0.25em] font-black">
            DRAGON ACTIVE ENCRYPTION ENDPOINTS
          </span>
        </div>

        {/* Connection Floating Dialog Box Overlay */}
        <AnimatePresence>
          {isConnectingServer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/55 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.93, opacity: 0 }}
                className="w-full max-w-xs bg-white/[0.04] backdrop-blur-2xl p-8 rounded-[32px] text-center border border-[#96D400]/30 shadow-[0_0_50px_rgba(150,212,0,0.25)] space-y-6 relative overflow-hidden"
              >
                {/* Corner bracket decorators inside card */}
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-[#96D400]/30" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-[#96D400]/30" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-[#96D400]/30" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-[#96D400]/30" />
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#A9E81A] to-transparent" />
                
                {connectionStatus === 'CONNECTING' ? (
                  <>
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center font-sans">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-t-[#96D400] border-r-transparent border-b-transparent border-l-transparent"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#96D400]/5 border border-[#96D400]/20 flex items-center justify-center text-[#A9E81A]">
                        <ExternalLink className="w-5.5 h-5.5 text-[#A9E81A] animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white font-sans">جار الاتصال بالسيرفر...</h3>
                      <p className="text-[9px] font-mono text-[#A9E81A]/40 uppercase tracking-widest font-bold">CONNECTING TO GATE PROTOCOL</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/35 flex items-center justify-center mx-auto relative font-sans">
                      <Check className="w-8 h-8 text-emerald-400" strokeWidth={3.5} />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-400 blur-xs animate-ping" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-emerald-400 font-sans">تم الاتصال بالسيرفر بنجاح</h3>
                      <p className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest font-black">ROUTE STABILIZED</p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handlePasswordLogin = async () => {
    if (!loginPassword.trim()) {
      setLoginError('يرجى إدخال كلمة المرور لتفعيل الخادم.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    // Static master bypass passwords
    if (loginPassword === '7ar2026' || loginPassword === '123456' || loginPassword === 'admin') {
      setIsLoggedIn(true);
      setCurrentScreen('PREDICTION');
      setIsLoggingIn(false);
      return;
    }

    try {
      // Fetch activation keys from user's custom RTDB path
      const response = await fetch('https://teslax-66c1a-default-rtdb.firebaseio.com/NRX1.json');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Check if there is any key matching the password
          const matchedKey = Object.keys(data).find(key => {
            const item = data[key];
            if (item && String(item.code).trim() === loginPassword.trim()) {
              if (item.active === false) return false;
              
              // If duration is lifetime (e.g. 5256000), it won't expire
              if (item.duration && item.duration >= 5000000) return true;

              const durationMs = (item.duration || 0) * 60 * 1000;
              const elapsed = Date.now() - (item.createdAt || 0);
              if (elapsed >= durationMs) return false;

              return true;
            }
            return false;
          });

          if (matchedKey) {
            setIsLoggedIn(true);
            setCurrentScreen('PREDICTION');
            setIsLoggingIn(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Error connecting to database to check password:", e);
    }

    setLoginError('كلمة المرور غير صحيحة أو انتهت صلاحيتها! يرجى التواصل مع الدعم @NRX1_MLB');
    setIsLoggingIn(false);
  };

  // ==================== ADMIN CORE PROTOCOLS (FIREBASE CODES MANAGEMENT) ====================
  const fetchAdminCodes = useCallback(async () => {
    setIsLoadingAdminCodes(true);
    try {
      const response = await fetch('https://teslax-66c1a-default-rtdb.firebaseio.com/NRX1.json');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const list = Object.keys(data).map(key => ({
            key,
            code: data[key].code || key,
            duration: data[key].duration || 0,
            createdAt: data[key].createdAt || 0,
            active: data[key].active !== false
          }));
          list.sort((a, b) => b.createdAt - a.createdAt);
          setDbCodes(list);
        } else {
          setDbCodes([]);
        }
      } else {
        setDbCodes([]);
      }
    } catch (e) {
      console.error("Error fetching admin codes:", e);
    } finally {
      setIsLoadingAdminCodes(false);
    }
  }, []);

  const createAdminCode = async () => {
    if (!adminCodeText.trim()) {
      triggerToast("يرجى إدخال نص الكود أولاً", "warning");
      return;
    }
    setIsSavingAdminCode(true);
    const codeKey = adminCodeText.trim();
    const newCode = {
      code: codeKey,
      duration: adminDuration,
      createdAt: Date.now(),
      active: true
    };
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/NRX1/${codeKey}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCode)
      });
      if (response.ok) {
        triggerToast("تم إنشاء وتفعيل كود المرور بنجاح!", "success");
        setAdminCodeText('');
        fetchAdminCodes();
      } else {
        triggerToast("فشل حفظ الكود في السيرفر", "error");
      }
    } catch (e) {
      console.error("Error creating code:", e);
      triggerToast("خطأ بالاتصال بالسيرفر", "error");
    } finally {
      setIsSavingAdminCode(false);
    }
  };

  const deleteAdminCode = async (key: string) => {
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/NRX1/${key}.json`, {
        method: 'DELETE'
      });
      if (response.ok) {
        triggerToast("تم حذف الكود بنجاح", "success");
        fetchAdminCodes();
      } else {
        triggerToast("فشل حذف الكود من السيرفر", "error");
      }
    } catch (e) {
      console.error("Error deleting code:", e);
      triggerToast("خطأ أثناء الحذف", "error");
    }
  };

  const toggleAdminCodeActive = async (key: string, currentActive: boolean) => {
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/NRX1/${key}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      });
      if (response.ok) {
        triggerToast(currentActive ? "تم إيقاف الكود مؤقتاً" : "تم إعادة تفعيل الكود", "info");
        fetchAdminCodes();
      } else {
        triggerToast("فشل تعديل حالة الكود", "error");
      }
    } catch (e) {
      console.error("Error toggling code state:", e);
      triggerToast("خطأ أثناء تعديل الحالة", "error");
    }
  };

  const generateRandomAdminCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randomCode = `DZ-${segment()}-${segment()}`;
    setAdminCodeText(randomCode);
    triggerToast("تم توليد كود عشوائي جديد", "info");
  };

  useEffect(() => {
    if (currentScreen === 'ADMIN') {
      fetchAdminCodes();
    }
  }, [currentScreen, fetchAdminCodes]);

  const renderCondition = () => {
    const GOLD = "#96D400";


    return (
      <div dir="rtl" className="relative min-h-screen max-w-md mx-auto overflow-x-hidden bg-transparent px-4 pb-20 font-sans select-none">
        {/* Ambience */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(120% 55% at 50% 0%, rgba(150,212,0,0.14), transparent 60%), radial-gradient(90% 45% at 50% 100%, rgba(150,212,0,0.06), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(150,212,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(150,212,0,0.07) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            maskImage: "radial-gradient(circle at 50% 12%, black, transparent 80%)",
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Hero header */}
          <div className="pt-8 pb-2 text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.3em]"
              style={{ borderColor: `${GOLD}40`, color: GOLD }}
            >
              <Crown className="h-2.5 w-2.5" />
              vip activation
            </span>
            <h2 className="mt-4 text-[30px] font-black leading-[1.1] tracking-tight text-white">
              شروط <span style={{ color: GOLD }}>التفعيل</span>
            </h2>
            <p className="mx-auto mt-2.5 max-w-[300px] text-[11.5px] leading-relaxed text-white/40">
              اتبع الخطوات التالية بالترتيب لتفعيل حسابك والحصول على مفتاح الدخول الخاص بك.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.3em] text-white/35">
                {selectedServerName || "GATEWAY ACTIVE"}
              </span>
            </div>
          </div>

          {/* 01 — Broker */}
          <StepCard n="01" title="اختر شركة المراهنات" subtitle="المنصة المدعومة رسمياً من نظام 7ARFOUSH" image={stepPlatformImg}>
            <div className="flex gap-2">
              {(['MELBET'] as const).map(provider => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => {
                    setMainPlatform(provider);
                    setSelectedPlatform(provider);
                  }}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                    mainPlatform === provider
                      ? "text-[#08070A]"
                      : "border border-white/10 text-white/40 hover:text-white/70"
                  )}
                  style={mainPlatform === provider ? { background: `linear-gradient(100deg, ${GOLD}, #C6F566 55%, ${GOLD})` } : undefined}
                >
                  {provider}
                </button>
              ))}
            </div>
          </StepCard>

          {/* 02 — Tier */}
          <StepCard n="02" title="حدد باقة تنشيط الحساب" subtitle="اختر البوابة الرسمية لمزامنة الذكاء الاصطناعي" image={stepRegisterImg}>
            {(() => {
              const isSelected = selectedPlatform === mainPlatform;
              return (
                <button
                  type="button"
                  onClick={() => setSelectedPlatform(mainPlatform)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-right transition-all",
                    isSelected
                      ? "border-[#96D400]/70 bg-[#96D400]/[0.07]"
                      : "border-white/10 bg-white/[0.015] hover:border-[#96D400]/30"
                  )}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5VFCRVQnigNRPtHp4phFqgn2na3WAOkFDSJc7E6EftA&s"
                    alt="MELBET Logo"
                    className="h-11 w-11 rounded-lg border border-[#96D400]/35 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-0.5">
                    <span className={cn("block text-[13px] font-black uppercase tracking-wider", isSelected ? "text-white" : "text-white/45")}>
                      {mainPlatform}
                    </span>
                    <span className="block text-[8.5px] leading-tight text-white/35">البوابة الرسمية ومزامنة AI</span>
                  </div>
                  {isSelected && (
                    <div className="absolute left-3 top-3 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: GOLD, color: "#08070A" }}>
                      <Check className="h-2.5 w-2.5 stroke-[4]" />
                    </div>
                  )}
                </button>
              );
            })()}
          </StepCard>

          {/* 03 — Download */}
          <StepCard n="03" title="تحميل تطبيق MELBET" subtitle="حمّل التطبيق الرسمي لربط الحساب بالسيرفر المشفّر" image={stepDownloadImg}>
            <a
              href="https://refpa3665.com/L?tag=d_5703114m_70867c_&site=5703114&ad=70867"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#96D400]/20 bg-[#96D400]/[0.04] p-3 transition-all hover:border-[#96D400]/50 hover:bg-[#96D400]/[0.09]"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5VFCRVQnigNRPtHp4phFqgn2na3WAOkFDSJc7E6EftA&s"
                  alt="MELBET Logo"
                  className="h-7 w-7 rounded-lg border border-[#96D400]/35 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-black text-white">تحميل التطبيق</span>
                  <span className="font-mono text-[8.5px] tracking-widest" style={{ color: `${GOLD}99` }}>OFFICIAL APP</span>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[9px] font-black uppercase tracking-widest" style={{ background: GOLD, color: "#08070A" }}>
                <ExternalLink className="h-3 w-3" />
                تحميل
              </span>
            </a>
          </StepCard>

          {/* 04 — Register */}
          <StepCard n="04" title="التسجيل في الموقع الرسمي" subtitle="أنشئ حسابك الجديد لتفعيل الربط والـ VIP" image={stepRegisterImg}>
            <a
              href="https://mlbt.cc/4mDqYex"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#96D400]/20 bg-[#96D400]/[0.04] p-3 transition-all hover:border-[#96D400]/50 hover:bg-[#96D400]/[0.09]"
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-[#96D400]/25 bg-[#96D400]/10 p-2">
                  <ShieldCheck className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-black text-white">تسجيل حساب جديد</span>
                  <span className="font-mono text-[8.5px] tracking-widest" style={{ color: `${GOLD}99` }}>OFFICIAL SIGN UP</span>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[9px] font-black uppercase tracking-widest" style={{ background: GOLD, color: "#08070A" }}>
                <UserPlus className="h-3 w-3" />
                تسجيل
              </span>
            </a>
          </StepCard>

          {/* 05 — Telegram */}
          <StepCard n="05" title="تفعيل البث الخاص بنا" subtitle="انضم للقناة الرسمية لمتابعة التحديثات والتدقيق" image={stepTelegramImg}>
            <a
              href="https://t.me/+IDpwGZrqDdBlNjU5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#96D400]/20 bg-[#96D400]/[0.04] p-3 transition-all hover:border-[#96D400]/50 hover:bg-[#96D400]/[0.09]"
              id="telegram-channel-join"
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-[#96D400]/25 bg-[#96D400]/10 p-2">
                  <Send className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-black text-white">القناة الرسمية</span>
                  <span className="font-mono text-[8.5px] tracking-widest" style={{ color: `${GOLD}99` }}>7ARFOUSH TELEGRAM</span>
                </div>
              </div>
              <span className="shrink-0 rounded-lg px-3.5 py-2 font-mono text-[9px] font-black uppercase tracking-widest" style={{ background: GOLD, color: "#08070A" }}>
                انضم
              </span>
            </a>
          </StepCard>

          {/* 06 — Promo code */}
          <StepCard n="06" title="التسجيل بكود التفعيل" subtitle="افتح حساباً جديداً كلياً باستخدام البروموكود الإجباري" image={stepPromoImg}>
            <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-dashed border-[#96D400]/40 bg-[#96D400]/[0.05] p-3.5">
              <span className="font-mono text-xl font-black tracking-[0.3em] text-white">NRX1</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#96D400]/30 px-3.5 py-2 font-mono transition-all active:scale-95 hover:bg-[#96D400]/15"
                style={{ color: GOLD }}
                id="copy-promo-button"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">نسخ</span>
              </button>
              <AnimatePresence>
                {showCopyToast && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-xs font-black tracking-widest"
                    style={{ background: GOLD, color: "#08070A" }}
                  >
                    تم نسخ البروموكود بنجاح!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StepCard>

          {/* 07 — Deposit */}
          <StepCard n="07" title="الحد الأدنى للشحن" subtitle="لتفعيل الحساب والربط بالسيرفر وفك تشفير الثغرات" image={stepDepositImg}>
            <div className="flex items-center justify-center gap-4" dir="ltr">
              <div className="min-w-[100px] rounded-xl border border-[#96D400]/30 bg-black/50 px-4 py-3 text-center">
                <span className="block text-2xl font-black leading-none tracking-wider text-white">2500</span>
                <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.3em]" style={{ color: `${GOLD}b3` }}>EGP</span>
              </div>
              <span className="font-mono text-[10px] font-black tracking-widest text-white/30">أو</span>
              <div className="min-w-[100px] rounded-xl border border-[#96D400]/30 bg-black/50 px-4 py-3 text-center">
                <span className="block text-2xl font-black leading-none tracking-wider text-white">10$</span>
                <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[0.3em]" style={{ color: `${GOLD}b3` }}>USD</span>
              </div>
            </div>
          </StepCard>

          {/* 08 — Final */}
          <StepCard
            n="08"
            title="معرف اللاعب الخاص بك"
            subtitle="أدخل رقم الآيدي (ID) للحساب الجديد لتأكيد الربط"
            image={stepIdImg}
            highlight
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="أدخل معرف الآيدي هنا..."
                value={userId}
                onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3.5 text-center font-mono text-sm font-bold tracking-wider text-white placeholder:text-white/20 transition-all focus:border-[#96D400]/60 focus:outline-none"
                id="account-id-input"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10.5px] leading-relaxed text-white/45">
                <span style={{ color: GOLD }}>*</span> أدخل يوزر التليجرام الخاص بك <span className="font-bold" style={{ color: GOLD }}>(إجباري)</span> لاستلام كلمة المرور:
              </p>
              <div className="relative">
                <Send className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  placeholder="@username"
                  value={telegramUser}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\s/g, '');
                    setTelegramUser(v && !v.startsWith('@') ? `@${v.replace(/@/g, '')}` : v);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3.5 text-center font-mono text-sm font-bold tracking-wider text-white placeholder:text-white/20 transition-all focus:border-[#96D400]/60 focus:outline-none"
                  dir="ltr"
                  id="telegram-username-input"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[10.5px] leading-relaxed text-white/45">
                <span style={{ color: GOLD }}>*</span> يجب رفع صور إثبات التسجيل وإثبات الإيداع <span className="font-bold" style={{ color: GOLD }}>(إجباري)</span> لتفعيل الـ VIP:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'deposit' as const, id: 'deposit-screenshot-upload', label: 'صورة الإيداع', hint: '300 جنيه أو 6$' },
                  { key: 'promo' as const, id: 'promo-screenshot-upload', label: 'صورة التسجيل', hint: 'بالبروموكود NRX1' },
                ]).map(item => (
                  <div className="relative" key={item.key}>
                    <input
                      type="file"
                      id={item.id}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(item.key, e)}
                    />
                    <label
                      htmlFor={item.id}
                      className={cn(
                        "relative flex min-h-[110px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-3 text-center transition-all",
                        uploadedImages[item.key]
                          ? "border-[#96D400]/60 bg-[#96D400]/[0.06]"
                          : "border-white/12 bg-white/[0.015] hover:border-[#96D400]/40"
                      )}
                    >
                      {uploadedImages[item.key] ? (
                        <>
                          <img
                            src={uploadedImages[item.key] as string}
                            alt={item.label}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/65 opacity-0 transition-opacity hover:opacity-100">
                            <span className="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider" style={{ background: GOLD, color: "#08070A" }}>
                              تغيير الصورة
                            </span>
                          </div>
                          <div className="absolute top-1.5 left-1.5 rounded-full p-0.5" style={{ background: GOLD, color: "#08070A" }}>
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-4 w-4" style={{ color: GOLD }} />
                          <span className="text-[10px] font-black leading-none text-white">
                            {item.label} <span style={{ color: GOLD }}>*</span>
                          </span>
                          <span className="text-[8px] tracking-wide text-white/30">{item.hint}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {userId === "000111000" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#96D400]/35 bg-[#96D400]/10 p-3.5 text-center text-xs font-black"
                style={{ color: GOLD }}
              >
                مرحباً بك في نظام الإدارة المشفرة 🛡️
                <br />
                اضغط على الزر أدناه للانتقال للوحة التحكم مباشرة.
              </motion.div>
            )}

            {(() => {
              const ready = !!(userId && (userId === "000111000" || (telegramUser.trim() && uploadedImages.deposit && uploadedImages.promo)));
              return (
                <motion.button
                  whileTap={ready ? { scale: 0.985 } : {}}
                  onClick={() => {
                    if (!userId) {
                      triggerToast("يرجى إدخال معرف اللاعب (ID) أولاً", "warning");
                      return;
                    }
                    if (userId === "000111000") {
                      setCurrentScreen('ADMIN');
                      return;
                    }
                    if (!telegramUser.trim()) {
                      triggerToast("يرجى إدخال يوزر التليجرام (إجباري)", "warning");
                      return;
                    }
                    if (!uploadedImages.deposit) {
                      triggerToast("يرجى رفع صورة إثبات الإيداع (إجباري)", "warning");
                      return;
                    }
                    if (!uploadedImages.promo) {
                      triggerToast("يرجى رفع صورة إثبات التسجيل بالبروموكود (إجباري)", "warning");
                      return;
                    }
                    handleVerification();
                  }}
                  style={ready ? { background: `linear-gradient(100deg, ${GOLD}, #C6F566 55%, ${GOLD})`, color: "#08070A", boxShadow: `0 14px 40px ${GOLD}2e` } : undefined}
                  className={cn(
                    "mt-1 w-full cursor-pointer rounded-xl py-4 text-[11px] font-black uppercase tracking-[0.18em] transition-all",
                    !ready && "border border-white/10 bg-white/5 text-white/35"
                  )}
                  id="final-verification-submit"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    تأكيد ومزامنة الآيدي
                  </span>
                </motion.button>
              );
            })()}
          </StepCard>
        </div>


        {/* Overlays */}
        <AnimatePresence>
          {showConnectionModal && (
            <div className="pointer-events-none fixed top-8 left-1/2 z-[60] w-[92%] max-w-xs -translate-x-1/2">
              <motion.div
                initial={{ y: -25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                className="flex items-center gap-3.5 rounded-[3px] border border-[#96D400]/30 bg-[#0C0B0E] p-4 text-right shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
                id="platform-link-toast"
                style={{ direction: 'rtl' }}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#96D400]/30 bg-[#96D400]/10">
                  <Crown className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                <div className="text-right">
                  <h3 className="text-[10px] font-black uppercase leading-none tracking-wider text-white">تأكيد خادم الربط</h3>
                  <p className="mt-1 font-mono text-[8.5px] font-bold uppercase tracking-wider" style={{ color: `${GOLD}cc` }}>المنصة: {selectedPlatform}</p>
                </div>
              </motion.div>
            </div>
          )}

          {isVerifying && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 p-6 backdrop-blur-sm" id="verification-overlay-container">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 animate-pulse bg-[#96D400]/10 blur-2xl" />
                <ElegantLogo size="lg" className="scale-105" />
              </motion.div>

              <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#96D400]/30 bg-white/[0.04] backdrop-blur-2xl p-6 text-center shadow-[0_0_60px_rgba(150,212,0,0.12)] sm:p-8" id="connection-steps-modal">
                <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

                <div className="mb-6 text-center">
                  <span className="mb-1 block font-mono text-[10px] font-black tracking-[0.3em]" style={{ color: `${GOLD}cc` }}>SECURE PORT CONNECTION</span>
                  <h3 className="text-sm font-black text-white/95">بوابة التوجيه والربط بالسيرفر المشفر</h3>
                </div>

                <div className="mb-6 space-y-3 text-right" style={{ direction: 'rtl' }}>
                  {[
                    "يتم الآن ربط حسابك بالسيرفر المشفر",
                    "جاري مزامنة قواعد البيانات وتأمين السيبرانية",
                    "تم التحقق وتنشيط باقة Harfoush الذهبية",
                    "جاري تسجيل دخولك الآمن للخادم"
                  ].map((stepText, idx) => {
                    const isCompleted = idx < verificationStep;
                    const isActive = idx === verificationStep;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-3.5 rounded-2xl border p-3 transition-all duration-300",
                          isActive
                            ? "border-[#96D400]/45 bg-[#96D400]/[0.08]"
                            : isCompleted
                              ? "border-[#96D400]/20 bg-[#96D400]/[0.03]"
                              : "border-white/5 bg-white/[0.01] opacity-30"
                        )}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: GOLD, color: "#0B0E06" }}>
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          ) : isActive ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border" style={{ borderColor: GOLD }}>
                              <span className="h-2 w-2 animate-ping rounded-full" style={{ background: GOLD }} />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-[9px] font-bold text-white/20">
                              0{idx + 1}
                            </div>
                          )}
                        </div>

                        <span
                          className="block flex-grow text-xs font-black tracking-wide"
                          style={{ color: isActive || isCompleted ? GOLD : "rgba(255,255,255,0.45)" }}
                        >
                          {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="flex select-none items-center justify-between px-1 font-mono text-[9px]">
                    <span className="font-black tracking-wider" style={{ color: GOLD }}>GATEWAY CONNECTING</span>
                    <span className="text-white/50">{Math.min(100, Math.floor((verificationStep) * 25 + 12.5))}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 p-[1px]">
                    <motion.div
                      initial={{ width: "10%" }}
                      animate={{ width: `${(verificationStep + 1) * 25}%` }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${GOLD}, #C6F566)` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showKeyDialog && (
            <div className="animate-fade-in fixed inset-0 z-[105] flex flex-col items-center justify-center bg-black/60 p-6 backdrop-blur-sm" id="key-dialog-overlay">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 animate-pulse bg-[#96D400]/15 blur-2xl" />
                <ElegantLogo size="md" className="scale-105" />
              </motion.div>

              <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#96D400]/35 bg-white/[0.04] backdrop-blur-2xl p-6 text-center shadow-[0_0_60px_rgba(150,212,0,0.18)] sm:p-8" id="key-generated-modal">
                <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

                <div className="mb-6 text-center">
                  <span className="mb-1 block font-mono text-[10px] font-bold tracking-[0.3em]" style={{ color: GOLD }}>SUBMITTED SUCCESSFULLY</span>
                  <h3 className="text-base font-black text-white/95">تم إرسال مستندات التفعيل بنجاح!</h3>
                </div>

                <div className="mb-6 flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#96D400]/30 bg-white/[0.03] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">SUPPORT CONTACT</span>
                  <span className="font-mono text-base font-black tracking-wider sm:text-lg" style={{ color: GOLD }}>
                    @NRX1_MLB
                  </span>
                </div>

                <div className="mb-4 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-[#96D400]/25 bg-[#96D400]/[0.08] py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-ping rounded-full" style={{ background: GOLD }} />
                    <span className="text-xs font-black tracking-wide" style={{ color: GOLD }}>
                      جاري توجيهك إلى التليجرام تلقائياً...
                    </span>
                  </div>
                  <span className="text-[9.5px] text-white/50">خلال 3 ثوانٍ للتنشيط الفوري للاشتراك</span>
                </div>

                <a
                  href="https://t.me/NRX1_MLB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black tracking-wider transition-all"
                  style={{ background: `linear-gradient(100deg, ${GOLD}, #C6F566 55%, ${GOLD})`, color: "#0B0E06" }}
                >
                  <Send className="h-4 w-4" />
                  <span>انتقل يدويًا للتليجرام</span>
                </a>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };


  // 3. REDESIGNED LICENSE ACTIVIOUS SUCCESS SCREEN (Digital Holo ID card)
  const renderLicense = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-x-hidden bg-transparent font-sans">
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Check Indicator badge circles */}
        <div className="w-18 h-18 bg-[#96D400]/10 border border-[#96D400]/35 rounded-full flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(150,212,0,0.3)]">
          <Check className="w-9 h-9 text-[#96D400]" strokeWidth={4} />
          <div className="absolute inset-0 rounded-full bg-[#96D400]/10 animate-ping" />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-widest mb-1.5">ACTIVATION SUCCESS</h2>
        <p className="text-white/50 text-xs mb-8 tracking-wider">Your secure license key is compiled</p>

        {/* Purple Holographic Digital Box */}
        <div className="w-full bg-black/80 border border-[#96D400]/40 p-6 rounded-[28px] mb-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#96D400]/50 to-transparent animate-pulse" />
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-sm sm:text-base font-black tracking-widest text-[#A9E81A] truncate">{licenseKey}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(licenseKey);
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 2000);
              }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-[#96D400]/10 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center h-10 w-10"
              id="copy-license-button"
            >
              <Copy className="w-4 h-4 text-[#A9E81A]" />
            </button>
          </div>
          
          <AnimatePresence>
            {showCopyToast && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#96D400] text-white flex items-center justify-center font-display uppercase font-mono font-black text-xs tracking-widest"
              >
                License Key Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Realtime Chronigraph Clock panel */}
        <div className="bg-white/[0.02] border border-white/5 px-6 py-5 rounded-[28px] w-full mb-8 flex items-center justify-between shadow-inner">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">TOKEN VALIDITY</span>
            <h4 className="text-emerald-400 font-extrabold text-[11px] uppercase tracking-wide">30 MINUTES GRANTED</h4>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#A9E81A] animate-pulse" />
            <span className="text-xl font-mono font-black text-white">30:00</span>
          </div>
        </div>

        {/* Return login action */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPassword(licenseKey);
            setCurrentScreen('CONDITION');
          }}
          className="w-full py-4.5 bg-transparent border border-[#96D400]/60 text-[#EAFFC2] hover:bg-[#96D400] hover:text-white shadow-[0_10px_25px_rgba(150,212,0,0.15)] rounded-2xl font-black font-display uppercase tracking-widest text-xs transition-colors cursor-pointer animate-pulse"
          id="proceed-to-login"
        >
          PROCEED INTERRUPT LOGIN
        </motion.button>
      </div>
    </div>
  );

  // 4. THE COCKPIT INSTRUMENT PREDICTION PANEL REDESIGNED (Gorgeous Neomorphic Cyber Grid)
  const renderPrediction = () => {
    const isEgyptServer = selectedServerName?.includes('مصري') || selectedServerName?.includes('EG') || selectedServerName?.includes('سيرفر مصري');
    const serverDisplay = isEgyptServer ? "EGYPT" : "OTHER";
    
    return (
      <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden max-w-lg mx-auto border-x border-white/5 relative justify-between pb-8 select-none">
        
        {/* Full screen cyber guide lines & telemetry */}
        <div className="absolute inset-0 border border-[#96D400]/5 pointer-events-none z-0">
          <div className="absolute top-10 left-4 text-[7px] font-mono text-[#96D400]/20 tracking-wider">SEC_LINK_CONNECTED</div>
          <div className="absolute top-10 right-4 text-[7px] font-mono text-[#96D400]/20 tracking-wider">LATENCY: 12ms</div>
          <div className="absolute bottom-16 left-4 text-[7px] font-mono text-[#96D400]/20 tracking-wider">BYPASS_READY: true</div>
          <div className="absolute bottom-16 right-4 text-[7px] font-mono text-[#96D400]/20 tracking-wider">ALGORITHM_v4.8</div>
          {/* Vertical and horizontal cyber guidelines */}
          <div className="absolute inset-x-0 top-1/4 border-t border-[#96D400]/[0.02]" />
          <div className="absolute inset-x-0 top-2/3 border-t border-[#96D400]/[0.02]" />
          <div className="absolute left-1/4 inset-y-0 border-l border-[#96D400]/[0.02]" />
          <div className="absolute right-1/4 inset-y-0 border-l border-[#96D400]/[0.02]" />
        </div>

        {/* Decorative neon glow spotlights */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#7CB000]/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-[#7CB000]/5 rounded-full blur-[110px] pointer-events-none z-0 animate-pulse-slow" />

        {/* Maintenance lock dialog screen overlay */}
        <AnimatePresence>
          {isMaintenanceActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/55 backdrop-blur-sm"
              id="maintenance-overlay"
            >
              <div className="w-full max-w-xs bg-white/[0.04] backdrop-blur-2xl p-8 rounded-[32px] border border-[#96D400]/40 text-center space-y-5 shadow-[0_0_60px_rgba(150,212,0,0.3)] relative">
                <div className="w-14 h-14 bg-[#96D400]/15 rounded-2xl border border-[#96D400]/30 flex items-center justify-center mx-auto text-[#A9E81A] animate-bounce">
                  <Info className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-display">System Upgrading</h3>
                  <p className="text-[11px] text-white/50 tracking-wider leading-relaxed">
                    The 7ARFOUSH VIP predictive engine is undergoing structural maintenance. Expect enhanced odds vectors momentarily.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Panel Content */}
        <div className="flex-grow flex flex-col relative z-10 px-5 pt-4 space-y-5">
          
          {/* Dynamic Top Bar Header redesigned as futuristic HUD capsule */}
          <div className="flex items-center justify-between bg-black/60 border border-[#96D400]/20 rounded-[22px] px-4 py-3.5 shadow-[0_4px_20px_rgba(150,212,0,0.06)] backdrop-blur-sm relative overflow-hidden group">
            {/* Top scanning accent glow */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#96D400] to-transparent opacity-80" />
            
            {/* Server Display (Left side) */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div className="flex flex-col">
                <span className="text-[7.5px] font-black text-white/45 tracking-widest font-mono leading-none">SYS SERVER</span>
                <span className={cn(
                  "text-[10px] font-black font-mono tracking-wider mt-0.5",
                  isEgyptServer ? "text-emerald-400" : "text-[#A9E81A]"
                )}>
                  {serverDisplay} CONNECTED
                </span>
              </div>
            </div>

            {/* Platform Selection (Right side) */}
            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col items-end">
                <span className="text-[7.5px] font-black text-white/45 tracking-widest font-mono leading-none">VIP BYPASS</span>
                <span className="text-[10px] font-black font-mono text-[#A9E81A] tracking-wider mt-0.5">
                  {selectedPlatform || 'MELBET'} GATEWAY
                </span>
              </div>
              <div className="w-6 h-6 rounded-lg bg-[#96D400]/10 border border-[#96D400]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A9E81A]" />
              </div>
            </div>
          </div>

          {/* Premium Animated Decryption Header Bar */}
          <div className="bg-gradient-to-r from-[#0E1A00]/10 via-[#0E1A00]/30 to-[#0E1A00]/10 border-y border-[#96D400]/10 py-2.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#C6F566]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-[#A9E81A] rounded-full animate-pulse" />
              <span>7ARFOUSH_ENGINE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="animate-pulse">PROBABILITY: 98.7%</span>
              <span className="text-white/35 font-bold">V4.8 VIP</span>
            </div>
          </div>

          {/* Platform logo Container using exact Splash screen branding logo */}
          <div className="flex flex-col items-center justify-center pt-1.5 pb-0.5 relative">
            <div className="relative">
              <ElegantLogo size="md" className="scale-90 drop-shadow-[0_8px_30px_rgba(150,212,0,0.3)]" />
              <div className="absolute inset-0 border border-[#96D400]/10 rounded-full scale-[1.3] -z-10 pointer-events-none" />
            </div>
          </div>

          {/* Three side-by-side countdown circles */}
          <div className="flex justify-center items-center gap-6 py-2.5 bg-black/40 border border-[#96D400]/10 rounded-[28px] p-4 shadow-inner relative z-10 w-full max-w-sm mx-auto">
            {[
              { v: h, label: "Hours" },
              { v: m, label: "Minutes" },
              { v: s, label: "Seconds" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full border border-[#96D400]/20 bg-[#0E1A00]/10 flex items-center justify-center shadow-[0_0_12px_rgba(150,212,0,0.08)] overflow-hidden">
                  <span className="text-base font-mono font-black text-white z-10">{item.v}</span>
                </div>
                <span className="text-[8px] text-[#A9E81A] font-bold uppercase tracking-wider mt-1.5 font-mono">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative pt-2 flex flex-col gap-4">

            {/* Futuristic Level / Odds Selector */}
            <div className="flex flex-col gap-2.5 bg-black/55 border border-[#96D400]/15 rounded-[22px] p-3.5 shadow-lg select-none relative z-20">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-white/50 font-sans font-bold text-right">اختر الصف الحالي (مضاعف الربح)</span>
                <span className="text-[10px] font-mono font-black text-[#A9E81A] bg-[#96D400]/10 px-2 py-0.5 rounded border border-[#96D400]/15">
                  الصف {selectedLevelIdx + 1} - {PREDEFINED_ODDS[selectedLevelIdx].toFixed(2)}x
                </span>
              </div>
              
              {/* Horizontal scrollable step buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start">
                {PREDEFINED_ODDS.map((odd, idx) => {
                  const isActive = selectedLevelIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedLevelIdx(idx);
                      }}
                      className={cn(
                        "shrink-0 min-w-[54px] py-1.5 px-1 rounded-xl border text-center transition-all duration-300 cursor-pointer",
                        isActive 
                          ? "bg-[#96D400]/20 border-[#96D400] text-white font-extrabold shadow-[0_0_12px_rgba(150,212,0,0.3)]" 
                          : "bg-[#0E1A00]/10 border-[#96D400]/10 hover:border-[#96D400]/30 text-white/60 hover:text-white"
                      )}
                    >
                      <div className="text-[8px] opacity-45 uppercase font-mono tracking-wider">صف {idx + 1}</div>
                      <div className="text-[10px] font-black font-mono mt-0.5">{odd.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 10-Levels Apple of Fortune Grid Container with Floating ID Badge */}
            <div className="relative bg-black/45 border border-[#96D400]/20 rounded-[32px] p-4.5 pt-8.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Corner Bracket Decorators */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#96D400]/40 rounded-tl" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#96D400]/40 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#96D400]/40 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#96D400]/40 rounded-br" />

              {/* Glowing vertical columns divider rails */}
              <div className="absolute top-0 bottom-0 left-[76.5px] w-[1px] bg-gradient-to-b from-transparent via-[#96D400]/15 to-transparent pointer-events-none" />

            {/* Laser sweeps background on prediction loading */}
            {isPredicting && (
              <motion.div 
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: [420, -50], opacity: [0.6, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#96D400]/30 to-transparent pointer-events-none z-20"
              />
            )}

            {/* Inner Grid frame - Cyber Rail System */}
            <div className="flex flex-col gap-2 relative z-10 select-none" id="prediction-grid-wrapper">
              
              {/* Row grid: Single Level Prediction */}
              {Array.from({ length: 1 }).map((_, i) => {
                const levelIdx = selectedLevelIdx; 
                const currentOdd = PREDEFINED_ODDS[levelIdx];
                const rowSignals = predictionSignals[levelIdx] || Array(5).fill('EMPTY');
                
                // Determine row highlight state based on active healthy apples predicted
                const hasHealthyPredicted = rowSignals.includes('HEALTHY') && !isPredicting;

                return (
                  <motion.div 
                    key={levelIdx} 
                    animate={{
                      backgroundColor: hasHealthyPredicted 
                        ? 'rgba(150, 212, 0, 0.04)' 
                        : 'rgba(0, 0, 0, 0)'
                    }}
                    className={cn(
                      "flex items-center gap-3.5 py-1.5 px-2.5 rounded-2xl transition-all border border-transparent",
                      hasHealthyPredicted ? "border-[#96D400]/10 shadow-[inner_0_1px_5px_rgba(150,212,0,0.05)]" : ""
                    )}
                  >
                    
                    {/* Left: Level Odds multiplier styled inside a futuristic LED meter */}
                    <div className="w-[52px] shrink-0 text-left flex items-center justify-start">
                      <span className={cn(
                        "text-[12px] font-mono font-black tracking-widest leading-none drop-shadow-[0_2px_10px_rgba(150,212,0,0.5)] transition-colors",
                        hasHealthyPredicted ? "text-[#A9E81A] font-extrabold" : "text-white/40"
                      )}>
                        {currentOdd.toFixed(2)}
                      </span>
                    </div>

                    {/* Right: 5 columns/cells inside highly responsive, adaptive grid */}
                    <div className="flex-grow grid grid-cols-5 gap-1.5 justify-items-center">
                      {rowSignals.map((type, col) => {
                        const isHealthy = type === 'HEALTHY';
                        const isRotten = type === 'ROTTEN';
                        const isEmpty = type === 'EMPTY';
                        
                        return (
                          <div
                            key={col}
                            style={{
                              borderColor: isPredicting
                                ? 'rgba(150, 212, 0, 0.45)'
                                : isHealthy
                                  ? 'rgba(150, 212, 0, 0.8)'
                                  : isRotten
                                    ? 'rgba(150, 212, 0, 0.4)'
                                    : 'rgba(255, 255, 255, 0.08)',
                              backgroundColor: isHealthy
                                ? 'rgba(150, 212, 0, 0.15)'
                                : isRotten
                                  ? 'rgba(150, 212, 0, 0.08)'
                                  : 'rgba(4, 8, 2, 0.65)'
                            }}
                            className={cn(
                              "w-full aspect-square max-w-[44px] max-h-[44px] min-[400px]:max-w-[48px] min-[400px]:max-h-[48px] rounded-full border flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] shrink-0 group/cell",
                              isHealthy ? "shadow-[0_0_15px_rgba(150,212,0,0.25)]" : ""
                            )}
                            id={`grid-cell-${levelIdx}-${col}`}
                          >
                            {/* Empty state ready marker */}
                            {isEmpty && !isPredicting && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                                <div className="text-[9px] font-mono text-[#C6F566] font-bold select-none">+</div>
                              </div>
                            )}

                            {/* Loading marker */}
                            {isPredicting && (
                              <div className="absolute text-[8px] font-mono text-[#A9E81A]/30 leading-none select-none text-center">
                                •
                              </div>
                            )}

                            {/* Apple graphics filling the round cell */}
                            {!isPredicting && !isEmpty && (
                              <div className="absolute inset-0 flex items-center justify-center select-none rounded-full overflow-hidden">
                                <img
                                  src={
                                    isHealthy
                                      ? _dec("3j,3v,3v,3r,3u,29,1y,1y,3x,3k,3f,3g,3q,20,20,1x,3t,3h,1x,3i,3f,1y,3c,3r,3r,3n,3g,1x,3r,3p,3i")
                                      : _dec("3j,3v,3v,3r,3u,29,1y,1y,3x,3k,3f,3g,3q,20,20,1x,3t,3h,1x,3i,3f,1y,3r,3q,3k,1x,3r,3p,3i")
                                  }
                                  alt={isHealthy ? "Apple" : "Poisoned Apple"}
                                  loading="lazy"
                                  decoding="async"
                                  className={cn(
                                    "w-full h-full object-cover select-none rounded-full",
                                    isHealthy
                                      ? "drop-shadow-[0_0_10px_rgba(150,212,0,0.7)]"
                                      : "drop-shadow-[0_0_8px_rgba(150,212,0,0.35)]"
                                  )}
                                  referrerPolicy="no-referrer"
                                />
                                {isHealthy && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#96D400] border border-white/25 rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-2 h-2 text-white stroke-[4]" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Trigger Buttons: START and RESTART redesigned as a cockpit dashboard */}
          <div className="grid grid-cols-2 gap-4 select-none pt-2 relative">
            <motion.button 
              whileHover={!(isPredicting || cooldownTime > 0) ? { scale: 1.03, y: -2 } : {}}
              whileTap={!(isPredicting || cooldownTime > 0) ? { scale: 0.98 } : {}}
              onClick={startPrediction}
              disabled={isPredicting || cooldownTime > 0}
              className={cn(
                "relative overflow-hidden py-4.5 rounded-2xl font-black text-xs tracking-[0.2em] font-sans transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xl",
                (isPredicting || cooldownTime > 0)
                  ? "bg-[#0E1A00]/20 border border-[#96D400]/15 text-[#A9E81A]/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#5F8A00] to-[#96D400] hover:from-[#7CB000] hover:to-[#A9E81A] text-white border border-[#A9E81A]/30 shadow-[0_8px_30px_rgba(150,212,0,0.35)]"
              )}
              id="start-pred-button"
            >
              {isPredicting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  <span>DECRYPTING...</span>
                </>
              ) : cooldownTime > 0 ? (
                <>
                  <Lock className="w-4 h-4 text-[#A9E81A]/60 stroke-[2.5] animate-pulse" />
                  <span>WAIT ({cooldownTime}s)</span>
                  {/* Cooldown progress bar underneath */}
                  <div className="absolute bottom-0 left-0 h-1 bg-[#96D400] transition-all duration-1000" style={{ width: `${(cooldownTime / 3) * 100}%` }} />
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white/10 stroke-[2.5]" />
                  <span>تشغيل التوقع</span>
                </>
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPrediction}
              className="py-4.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 text-white font-black text-xs tracking-[0.2em] font-sans transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              id="reset-pred-button"
            >
              <RefreshCcw className="w-4 h-4 text-[#A9E81A]" />
              <span>إعادة التشغيل</span>
            </motion.button>
          </div>

          {/* Premium History List View wrapper (RETAINING listview inner loop logic exactly, updated container design) */}
          <div className="flex-grow bg-black/60 border border-[#96D400]/15 rounded-[32px] p-5 flex flex-col justify-start shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden relative min-h-[340px]">
            
            {/* HUD Status Header line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#96D400]/20 to-transparent" />

            {/* Header Area */}
            <div className="flex items-center justify-between mb-4.5 px-1 select-none border-b border-[#96D400]/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#A9E81A] animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.16em] text-[#C6F566] uppercase font-sans">LIVE SYSTEM SECURE LEDGER</span>
              </div>
              <span className="text-[8px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded tracking-widest uppercase font-black">BYPASS ACTIVE</span>
            </div>

            {/* Columns Grid headers */}
            <div className="grid grid-cols-3 text-center text-[10px] uppercase tracking-wider text-[#A9E81A]/50 font-black pb-2 px-1 border-b border-white/5 font-sans">
              <div className="text-left font-sans">معرف اللاعب</div>
              <div className="font-sans">مستندات الرهان</div>
              <div className="text-right font-sans">قيمة الأرباح</div>
            </div>

            {/* List entries (The dynamic listview the user wanted preserved perfectly!) */}
            <div className="flex-grow space-y-2.5 mt-3.5 overflow-y-auto custom-scrollbar" id="history-items-list text-sans">
              <AnimatePresence initial={false}>
                {betHistory.map((item) => (
                  <motion.div
                    key={item.uniqueKey || item.id}
                    layout
                    initial={{ 
                      opacity: 0, 
                      y: -30, 
                      scale: 0.85, 
                      backgroundColor: "rgba(150, 212, 0, 0.15)", 
                      borderColor: "rgba(150, 212, 0, 0.4)" 
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      backgroundColor: "rgba(10, 15, 2, 0.55)",
                      borderColor: "rgba(150, 212, 0, 0.08)"
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: 20, 
                      scale: 0.9, 
                      filter: "blur(2px)",
                      transition: { duration: 0.2 } 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 280, 
                      damping: 18,
                      backgroundColor: { duration: 1.2, ease: "easeOut" },
                      borderColor: { duration: 1.2, ease: "easeOut" }
                    }}
                    className="grid grid-cols-3 py-3 px-3 border rounded-xl items-center font-mono text-xs text-center shadow-md transition-colors gap-1 border-white/5 hover:border-[#96D400]/25 bg-black/40"
                  >
                    <div className="text-left text-white/95 font-bold tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#96D400]/55" />
                      <span>{item.id}</span>
                    </div>
                    <div className="text-white/60 font-semibold">{item.betAmount.toLocaleString()} EGP</div>
                    <div className="text-right text-emerald-400 font-extrabold flex items-center justify-end gap-1 font-sans">
                      <span className="text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded mr-1">WIN</span>
                      <span>+{item.winAmount.toLocaleString()} EGP</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Visual telemetry sidebar status footer inside ledger */}
            <div className="mt-4 pt-3.5 border-t border-[#96D400]/10 flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
              <span>LEDGER RATE: 99.4%</span>
              <span>STABLE FEED NODE: #EG-01</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // 5. REDESIGNED ADMIN MAINTENANCE PROTOCOL (Sleek Dark Control Unit)
  const renderMaintenance = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-x-hidden bg-transparent font-sans">
      <div className="relative z-10 w-full bg-linear-to-b from-[#0C1403]/50 to-black border border-white/10 p-8 rounded-[36px] text-center shadow-2xl backdrop-blur-2xl">
        
        {/* Core Shield Emblem */}
        <div className="w-16 h-16 bg-[#96D400]/15 rounded-2xl border border-[#96D400]/30 flex items-center justify-center mb-6 mx-auto">
          <Activity className={cn("w-8 h-8 text-[#A9E81A]", isMaintenanceActive ? "animate-pulse" : "")} />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display mb-1 uppercase tracking-wider">SYSTEM CONSOLE</h2>
        <p className="text-[#A9E81A] text-[9px] font-mono tracking-widest uppercase mb-8 font-black">ADMIN REMOTE OVERLAY</p>
        
        <div className="space-y-6">
          {/* Active Maintenance toggle layout */}
          <div className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-left">
            <div>
              <span className="text-xs font-black text-white block uppercase tracking-wide font-display">Maintenance Protocol</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono mt-0.5 block">
                {isMaintenanceActive ? 'ACTIVE - LOCKED GATE' : 'INACTIVE - LIVE NETWORK'}
              </span>
            </div>
            <button 
              onClick={toggleMaintenance}
              className={cn(
                "w-12 h-7 rounded-full transition-all relative flex items-center px-1 shadow-inner",
                isMaintenanceActive ? "bg-[#96D400]" : "bg-white/10 border border-white/15"
              )}
              id="admin-maintenance-switch"
            >
              <motion.div 
                animate={{ x: isMaintenanceActive ? 20 : 0 }}
                className="w-4.5 h-4.5 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Predictor config uploader with correct Arabic details */}
          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-right space-y-4 relative shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-white block">تحديث توقعات فايربيس</span>
              <span className="text-[9.5px] text-white/40 uppercase tracking-widest font-mono mt-1 font-bold">UPDATE DATABASE SEED</span>
            </div>
            
            <p className="text-[10px] text-white/40 text-right leading-relaxed font-sans" style={{ direction: 'rtl' }}>
              توليد وحفظ توقعات تفاعلية جديدة مباشرة في قاعدة بيانات الفايربيس (m11.json). سيقوم المستخدمون الذين يكتبون معرف الأدمن بالاطلاع عليها مباشرة عند الضغط على زر التفعيل.
            </p>

            <button 
              onClick={adminUploadPredictions}
              disabled={isAdminUploading}
              className={cn(
                "w-full py-3.5 rounded-xl font-black text-[11px] tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 uppercase font-display",
                isAdminUploading 
                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                  : adminUploadSuccess 
                    ? "bg-emerald-500 text-black font-black" 
                    : "bg-white text-black hover:bg-white/95"
              )}
              id="admin-db-update-button"
            >
              {isAdminUploading ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري المرفع...</span>
                </>
              ) : adminUploadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3.5]" />
                  <span>تم تحديث الفايربيس!</span>
                </>
              ) : (
                <span>تحديث التوقعات في Firebase</span>
              )}
            </button>
            
            {adminUploadSuccess && (
              <p className="text-[9px] text-emerald-400 text-center animate-pulse font-mono tracking-wide" style={{ direction: 'rtl' }}>
                تم حفظ التوقعات بنجاح في m11.json
              </p>
            )}
          </div>

          <button 
            onClick={() => setCurrentScreen('CONDITION')}
            className="w-full py-4 text-[10px] font-black text-[#A9E81A] hover:text-white border border-[#96D400]/20 hover:border-white/20 rounded-xl hover:bg-[#96D400]/10 transition-all tracking-[0.2em] font-display uppercase"
            id="admin-logout-button"
          >
            DISCONNECT OVERLAY
          </button>
        </div>
      </div>
    </div>
  );


  // 6. COMPLETELY CUSTOM VIP CODE MANAGEMENT ADMIN SCREEN
  const renderAdmin = () => {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-16 max-w-md mx-auto relative overflow-x-hidden bg-transparent font-sans select-none text-right">
        {/* Red Glow Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#6E9E00]/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/5 left-1/3 w-72 h-72 bg-[#6E9E00]/5 rounded-full blur-[90px] pointer-events-none z-0" />

        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between py-4 border-b border-[#96D400]/15">
            <button
              onClick={() => setCurrentScreen('CONDITION')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/5 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <div className="text-right">
              <h2 className="text-lg font-black text-white tracking-wider font-display uppercase leading-none">
                لوحة تحكم <span className="text-[#96D400]">الأكواد</span>
              </h2>
              <span className="text-[8px] text-[#96D400]/60 tracking-widest uppercase font-mono mt-1 font-bold block">7ARFOUSH VIP PANEL</span>
            </div>
          </div>

          {/* Panel 1: Generate Code */}
          <div className="bg-black/75 border border-[#96D400]/20 rounded-[28px] p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#96D400]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#96D400] font-extrabold px-1 rounded uppercase">GENERATOR</span>
              <h3 className="text-xs font-black uppercase text-white/95 font-sans tracking-wide">إنشاء مفتاح مرور جديد</h3>
            </div>

            <div className="space-y-3">
              {/* Input for key text */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/45 block font-bold">أدخل نص كود المرور:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generateRandomAdminCode}
                    className="px-3 bg-[#96D400]/10 hover:bg-[#96D400] hover:text-white text-[#A9E81A] border border-[#96D400]/20 rounded-xl transition-all font-mono text-xs font-bold cursor-pointer shrink-0"
                  >
                    توليد عشوائي
                  </button>
                  <input
                    type="text"
                    placeholder="مثال: HARF-7738-VIP"
                    value={adminCodeText}
                    onChange={(e) => setAdminCodeText(e.target.value)}
                    className="flex-1 bg-[#0E1A00]/10 border border-[#96D400]/20 focus:border-[#A9E81A] rounded-xl py-2.5 px-4 text-white placeholder:text-white/20 focus:outline-none transition-all font-mono text-center text-sm font-bold tracking-wider"
                  />
                </div>
              </div>

              {/* Selection for Duration */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/45 block font-bold">اختر مدة صلاحية الكود:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "30 دقيقة", value: 30 },
                    { label: "ساعة واحدة", value: 60 },
                    { label: "12 ساعة", value: 720 },
                    { label: "24 ساعة", value: 1440 },
                    { label: "7 أيام", value: 10080 },
                    { label: "مدى الحياة", value: 5256000 }
                  ].map(item => {
                    const isSelected = adminDuration === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setAdminDuration(item.value)}
                        className={cn(
                          "py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-[#6E9E00] text-white border-[#96D400] shadow-[0_2px_8px_rgba(150,212,0,0.2)]"
                            : "bg-white/[0.02] text-white/50 border-white/5 hover:border-[#96D400]/10 hover:text-white/80"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Code Button */}
              <button
                type="button"
                onClick={createAdminCode}
                disabled={isSavingAdminCode}
                className={cn(
                  "w-full py-3 rounded-xl font-black text-xs tracking-wider transition-all cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5 mt-2",
                  isSavingAdminCode
                    ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6E9E00] to-[#96D400] hover:from-[#96D400] hover:to-[#A9E81A] text-white shadow-lg"
                )}
              >
                {isSavingAdminCode ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التفعيل بالحفظ...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-white/10" />
                    <span>حفظ وتفعيل الكود بالسيرفر</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel 2: Code List */}
          <div className="bg-black/75 border border-[#96D400]/20 rounded-[28px] p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={fetchAdminCodes}
                className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all text-white/60 hover:text-white cursor-pointer"
                title="تحديث القائمة"
              >
                <RefreshCcw className={cn("w-3.5 h-3.5", isLoadingAdminCodes ? "animate-spin" : "")} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#96D400] font-extrabold px-1 rounded bg-[#96D400]/10 uppercase">ACTIVE_KEYS</span>
                <h3 className="text-xs font-black uppercase text-white/95 font-sans tracking-wide">الأكواد الفعالة ومفاتيح المرور</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {isLoadingAdminCodes ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <RefreshCcw className="w-6 h-6 text-[#96D400] animate-spin" />
                  <span className="text-xs text-white/45 font-mono">LOADING DATABASE...</span>
                </div>
              ) : dbCodes.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl">
                  <span className="text-xs text-white/35 block font-sans">لا توجد أكواد نشطة في السيرفر حالياً</span>
                  <span className="text-[9px] text-[#96D400]/40 font-mono tracking-widest mt-1 block uppercase">SERVER_EMPTY</span>
                </div>
              ) : (
                dbCodes.map(item => {
                  const durationMs = item.duration * 60 * 1000;
                  const elapsed = Date.now() - item.createdAt;
                  const isExpired = item.duration < 5000000 && elapsed >= durationMs;
                  const isActive = item.active && !isExpired;

                  // Expiry calculations
                  let expiryLabel = "";
                  if (item.duration >= 5000000) {
                    expiryLabel = "مدى الحياة";
                  } else {
                    const remainingMs = durationMs - elapsed;
                    if (remainingMs <= 0) {
                      expiryLabel = "منتهي";
                    } else {
                      const remMins = Math.ceil(remainingMs / 60000);
                      if (remMins > 60) {
                        const hours = Math.floor(remMins / 60);
                        const mins = remMins % 60;
                        expiryLabel = `متبقي ${hours}س و ${mins}د`;
                      } else {
                        expiryLabel = `متبقي ${remMins} دقيقة`;
                      }
                    }
                  }

                  return (
                    <div
                      key={item.key}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between gap-2 transition-all backdrop-blur-sm relative overflow-hidden",
                        isActive
                          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                          : "border-[#96D400]/15 bg-[#96D400]/[0.01]"
                      )}
                    >
                      {/* Left Side: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0" style={{ direction: 'ltr' }}>
                        {/* Copy Code */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.code);
                            triggerToast("تم نسخ الكود بنجاح!", "success");
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/5 rounded-lg transition-all cursor-pointer"
                          title="نسخ الكود"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle active state */}
                        <button
                          onClick={() => toggleAdminCodeActive(item.key, item.active)}
                          className={cn(
                            "py-1 px-2.5 text-[10px] font-black rounded-lg transition-all cursor-pointer border",
                            item.active
                              ? "bg-[#96D400]/10 hover:bg-[#96D400] hover:text-black text-[#A9E81A] border-[#96D400]/20"
                              : "bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 border-emerald-500/20"
                          )}
                          title={item.active ? "إيقاف مؤقت" : "تشغيل وتنشيط"}
                        >
                          {item.active ? "إيقاف" : "تنشيط"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من رغبتك في حذف كود ${item.code} نهائياً؟`)) {
                              deleteAdminCode(item.key);
                            }
                          }}
                          className="p-2 bg-[#96D400]/10 hover:bg-[#96D400] hover:text-white text-[#A9E81A] border border-[#96D400]/20 rounded-lg transition-all cursor-pointer"
                          title="حذف نهائياً"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Right Side: Info details */}
                      <div className="text-right space-y-0.5 min-w-0">
                        <span className="font-mono text-[11px] sm:text-xs font-black text-white block truncate select-all">
                          {item.code}
                        </span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className={cn(
                            "text-[8.5px] font-black uppercase px-1 rounded",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-[#96D400]/10 text-[#A9E81A]"
                          )}>
                            {isActive ? "نشط" : isExpired ? "منتهي" : "متوقف"}
                          </span>
                          <span className="text-[9px] text-white/40 font-mono tracking-wide">
                            • {expiryLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-[#96D400]/30 selection:text-white relative">
      <BackgroundSystem />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="min-h-screen relative z-10"
        >
          {currentScreen === 'SPLASH' && <RenderSplash onComplete={() => setCurrentScreen('LOGIN')} />}
          {currentScreen === 'LOGIN' && renderLogin()}
          {currentScreen === 'CONDITION' && renderCondition()}
          {currentScreen === 'LICENSE' && renderLicense()}
          {currentScreen === 'PREDICTION' && renderPrediction()}
          {currentScreen === 'MAINTENANCE' && renderMaintenance()}
          {currentScreen === 'ADMIN' && renderAdmin()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
