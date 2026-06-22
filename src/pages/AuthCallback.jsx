import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../lib/auth";
import { motion } from "framer-motion";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      saveToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-black gradient-text"
      >
        CPSync
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-sm"
      >
        Completing sign‑in…
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="mt-2 w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
}