"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ImageUp, Save, Sparkles, User, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const MAX_AVATAR_FILE_SIZE = 1024 * 1024;

export default function ProfileSettingsPanel() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [avatarError, setAvatarError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  async function handleSave() {
    try {
      setStatus("saving");
      setSaveError("");
      await updateProfile({ name: name.trim(), avatar: avatar.trim() });
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save profile.");
      setStatus("error");
    }
  }

  function handleAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Choose an image file.");
      return;
    }

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setAvatarError("Image must be 1 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setAvatarError("");
      }
    };
    reader.onerror = () => setAvatarError("Could not read image file.");
    reader.readAsDataURL(file);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.14)]"
    >
      <div className="bg-gradient-to-r from-[#06224C] via-blue-700 to-cyan-500 px-6 py-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">Account Studio</p>
            <h2 className="mt-1 flex items-center gap-2 text-xl font-black">
              <Sparkles className="h-5 w-5 text-cyan-200" /> Profile Settings
            </h2>
          </div>
          {status === "saved" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-xs font-black text-emerald-950 shadow-lg"
            >
              <CheckCircle2 className="h-4 w-4" />
              Updated
            </motion.div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
        <motion.div
          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}
        >
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-blue-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-[#06224C] shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            maxLength={50}
          />
          <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">This name appears in your dashboard, account menu, and billing profile.</p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-white to-amber-50 p-5"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 340, damping: 24 }}
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-fuchsia-700">Avatar</span>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <motion.div
              key={avatar || "empty-avatar"}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_18px_45px_rgba(217,70,239,0.22)] ring-4 ring-fuchsia-100"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <User className="h-9 w-9 text-fuchsia-200" />
              )}
            </motion.div>

            <div className="min-w-0 flex-1 space-y-2">
              <input
                value={avatar}
                onChange={(event) => {
                  setAvatar(event.target.value);
                  setAvatarError("");
                }}
                placeholder="https://... or upload an image"
                className="w-full rounded-xl border border-fuchsia-100 bg-white px-3 py-2.5 text-sm font-medium text-[#06224C] shadow-sm outline-none transition-all focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
              />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-fuchsia-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  <ImageUp className="h-4 w-4" />
                  Upload
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="sr-only" />
                </label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar("");
                      setAvatarError("");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-xs font-bold text-rose-500 transition-all hover:bg-rose-50"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
              {avatarError && <p className="text-xs font-semibold text-red-500">{avatarError}</p>}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-3 px-6 pb-2 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Email</p>
          <p className="mt-0.5 truncate font-semibold text-[#06224C]">{user?.email || "-"}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Mobile</p>
          <p className="mt-0.5 font-semibold text-[#06224C]">{user?.mobile || "-"}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Plan</p>
          <p className="mt-0.5 font-semibold capitalize text-[#06224C]">{user?.plan || "free"} - {user?.subscriptionStatus || "none"}</p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        {saveError ? (
          <p className="mb-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">
            {saveError}
          </p>
        ) : null}
        <motion.button
          type="button"
          onClick={() => void handleSave()}
          disabled={status === "saving"}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#06224C] via-blue-700 to-cyan-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition-all disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Save Profile"}
        </motion.button>
      </div>
    </motion.section>
  );
}
