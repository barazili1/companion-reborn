import melbetLogo from '@/assets/melbet-logo.jpg';
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Zap, Hexagon } from "lucide-react";

interface RenderSplashProps {
  onComplete: () => void;
}

const NEON = "#96D400";

export const RenderSplash = ({ onComplete }: RenderSplashProps) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("جاري تفعيل الاتصال الآمن...");

  const statuses = [
    "تهيئة النواة المشفرة...",
    "فحص القناة الخاصة بالخادم...",
    "مزامنة مصفوفة التنبؤ...",
    "التحقق من ترخيص VIP...",
    "تم الاتصال بنجاح. مرحباً بك!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 12) + 6);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setStatusText(statuses[0]);
    else if (progress < 50) setStatusText(statuses[1]);
    else if (progress < 75) setStatusText(statuses[2]);
    else if (progress < 95) setStatusText(statuses[3]);
    else setStatusText(statuses[4]);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const delay = setTimeout(onComplete, 700);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen select-none flex-col overflow-hidden bg-transparent px-6 font-sans"
      id="luxury-splash"
    >
      {/* Neon horizon glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: `${NEON}22` }}
      />
      <div
        className="pointer-events-none absolute bottom-[-160px] left-1/2 z-0 h-[380px] w-[520px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: `${NEON}14` }}
      />

      {/* Technical grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(${NEON}0d 1px, transparent 1px), linear-gradient(90deg, ${NEON}0d 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 75%)",
        }}
      />

      {/* Scanning line */}
      <motion.div
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-x-0 z-0 h-24 blur-xl"
        style={{
          background: `linear-gradient(to bottom, transparent, ${NEON}18, transparent)`,
        }}
      />

      {/* Top HUD bar */}
      <div className="relative z-10 flex items-center justify-between pt-8 font-mono text-[9px] uppercase tracking-[0.3em]">
        <span style={{ color: `${NEON}99` }}>SECURE BOOT</span>
        <span className="text-white/25">V 3.0</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-12 text-center">
        {/* Hex emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-7 rounded-[38%] border"
            style={{ borderColor: `${NEON}26` }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 rounded-full border border-dashed"
            style={{ borderColor: `${NEON}14` }}
          />
          <motion.div
            animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-full blur-2xl"
            style={{ background: `${NEON}33` }}
          />
          <div
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border bg-[#070707]"
            style={{ borderColor: `${NEON}59`, boxShadow: `0 20px 60px ${NEON}1f` }}
          >
            <motion.div
              animate={{ x: [-140, 140] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 z-10 w-1/2 skew-x-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${NEON}1f, transparent)`,
              }}
            />
            <img
              src={melbetLogo}
              alt="7ARFOUSH VIP"
              className="pointer-events-none h-full w-full select-none object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Wordmark */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extralight tracking-[0.18em] text-white">
            7ARFOUSH{" "}
            <span className="font-black" style={{ color: NEON }}>
              VIP
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span
              className="h-px w-10"
              style={{ background: `linear-gradient(to left, transparent, ${NEON}66)` }}
            />
            <p
              className="font-mono text-[9px] font-semibold uppercase tracking-[0.4em]"
              style={{ color: `${NEON}b3` }}
            >
              PREMIUM DECRYPTER
            </p>
            <span
              className="h-px w-10"
              style={{ background: `linear-gradient(to right, transparent, ${NEON}66)` }}
            />
          </div>
        </div>

        {/* Progress console */}
        <div className="w-full max-w-sm">
          <div className="mb-3 flex items-end justify-between">
            <span className="text-xs font-medium text-white/70">{statusText}</span>
            <span className="font-mono text-2xl font-black leading-none" style={{ color: NEON }}>
              {progress}
              <span className="text-xs">%</span>
            </span>
          </div>

          <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${NEON}55, ${NEON})`,
                boxShadow: `0 0 18px ${NEON}80`,
              }}
              className="h-full rounded-full transition-all duration-200 ease-out"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: ShieldCheck, label: "ENCRYPTED" },
              { icon: Zap, label: "LOW LATENCY" },
              { icon: Hexagon, label: "VIP NODE" },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-3"
                style={progress > (i + 1) * 28 ? { borderColor: `${NEON}40` } : undefined}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: progress > (i + 1) * 28 ? NEON : "#ffffff40" }}
                />
                <span className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-white/40">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 text-center font-mono text-[8px] uppercase tracking-[0.35em] text-white/25">
        SECURE ACCESS GATEWAY
      </div>
    </div>
  );
};
