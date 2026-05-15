"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isApiConnectionError, verifyEmailOtp } from "@/lib/api";
import { assetPath } from "@/lib/paths";
import ResetFlowBackButton from "@/components/ResetFlowBackButton";

const resetFlowCardStyle = {
  background: "linear-gradient(180deg, #234E70 0%, #282738 100%)",
  boxShadow: "4px 4px 4px 0 rgba(0,0,0,0.25)",
} as const;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "email@example.com";
  const [code, setCode] = useState(["", "", "", ""]);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const isCodeComplete = code.every((digit) => digit !== "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
      setCode((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      if (value && index < 3) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`);
        nextInput?.focus();
      }
      setError("");
    };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isCodeComplete) {
      setError("Please enter the complete 4-digit code.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await verifyEmailOtp({
        email: contact,
        otp: code.join(""),
      });
      if (result.token) {
        window.sessionStorage.setItem("stackly-reset-token", result.token);
      }
      router.push(`/verified?contact=${encodeURIComponent(contact)}`);
    } catch (err) {
      if (isApiConnectionError(err)) {
        router.push("/backend-error");
        return;
      }
      const message = err instanceof Error
          ? err.message
          : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-flow-page relative min-h-[100dvh] flex flex-col justify-start lg:justify-center items-stretch overflow-y-auto px-0 py-0 lg:px-6 lg:py-6 max-lg:bg-transparent bg-white">
      <ResetFlowBackButton onClick={() => router.back()} />
      <div className="flex w-full flex-1 flex-col items-stretch justify-center max-lg:max-w-none max-w-[480px] lg:mx-auto min-h-0">
        <div
          className="reset-flow-card relative flex w-full flex-1 flex-col justify-center overflow-hidden px-6 py-8 sm:px-10 sm:py-10 text-center lg:flex-none lg:min-h-0 lg:rounded-xl"
          style={resetFlowCardStyle}
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src={assetPath("/email.webp")}
              alt="Email verification"
              className="w-[96px] h-[96px] object-contain"
            />
          </div>
          <h1 className="text-[20px] sm:text-[24px] font-bold mb-2" style={{ color: "#FFFFFF" }}>
            Verify your email
          </h1>
          <p className="text-[12px] sm:text-[13px] leading-relaxed mb-6" style={{ color: "#FFFFFF" }}>
            Please enter the 4 digit code sent to your<br />
            Registered email {contact}
          </p>

          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="flex justify-center gap-3 sm:gap-4">
              {code.map((value, idx) => (
                <input
                  key={idx}
                  id={`email-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={handleChange(idx)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded border bg-transparent text-center text-lg text-white outline-none focus:border-white/80"
                  style={{
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}
                />
              ))}
            </div>

            <p
              className="text-[12px] sm:text-[13px]"
              style={{ color: "#FFFFFF" }}
            >
              Want to change your Email Address?{" "}
              <button
                type="button"
                onClick={() =>
                  router.push("/forgot-password?changeFrom=verify-email")
                }
                className="underline font-semibold"
                style={{ color: "#F2B541" }}
              >
                Change Here
              </button>
            </p>

            <button
              type="submit"
              disabled={!isCodeComplete || isSubmitting}
              className="w-full max-w-[260px] mx-auto rounded-[1000px] text-[16px] sm:text-[17px] font-bold shadow-md hover:opacity-95 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                height: "48px",
                backgroundColor: "#F2B541",
                color: "#FFFFFF",
              }}
            >
              {isSubmitting ? "Verifying..." : "Confirm"}
            </button>

            {error && (
              <p className="text-[12px] mt-1" style={{ color: "#F2B541" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={async () => {
                setInfo("");
                setError("");
                try {
                  const result = await verifyEmailOtp({ email: contact, action: "resend" });
                  setInfo(result.message || "Code resent successfully.");
                } catch (err) {
                  if (isApiConnectionError(err)) {
                    router.push("/backend-error");
                    return;
                  }
                  setError(err instanceof Error ? err.message : "Could not resend code.");
                }
              }}
              className="text-[12px] sm:text-[13px] underline font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              Resend CODE
            </button>
            {info && (
              <p className="text-[11px] sm:text-[12px] mt-1" style={{ color: "#FFFFFF" }}>
                {info}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
