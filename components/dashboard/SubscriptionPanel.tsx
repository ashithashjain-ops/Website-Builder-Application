"use client";

import { useState } from "react";
import { CreditCard, XCircle } from "lucide-react";
import { cancelSubscription } from "@/lib/api";
import {
  createRazorpayOrder,
  isDemoRazorpayOrder,
  loadRazorpayCheckoutScript,
  openRazorpayCheckout,
  verifyRazorpayPayment,
} from "@/lib/razorpayClient";
import { useAuthStore } from "@/store/authStore";

const PREMIUM_AMOUNT_PAISE = 2900;

export default function SubscriptionPanel() {
  const { user, loadUser } = useAuthStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleUpgrade() {
    if (!user) return;

    try {
      setStatus("loading");
      setMessage("");
      const order = await createRazorpayOrder({
        amountPaise: PREMIUM_AMOUNT_PAISE,
        planName: "Premium",
        billingPeriod: "Monthly",
      });

      if (isDemoRazorpayOrder(order)) {
        const verified = await verifyRazorpayPayment({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo_signature",
          amount: order.amount,
          currency: order.currency,
          planName: "Premium",
          billingPeriod: "Monthly",
        });
        if (!verified) throw new Error("Demo payment verification failed");
        await loadUser();
        setStatus("success");
        setMessage("Premium subscription activated in Razorpay demo mode.");
        return;
      }

      await loadRazorpayCheckoutScript();
      setStatus("idle");
      openRazorpayCheckout({
        order,
        planLabel: "Stackly Premium (Monthly)",
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.mobile || "",
        onDismiss: () => setStatus("idle"),
        onSuccess: async (response) => {
          try {
            setStatus("loading");
            const verified = await verifyRazorpayPayment({
              ...response,
              amount: order.amount,
              currency: order.currency,
              planName: "Premium",
              billingPeriod: "Monthly",
            });
            if (!verified) throw new Error("Payment verification failed");
            await loadUser();
            setStatus("success");
            setMessage("Premium subscription activated.");
          } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Payment failed");
          }
        },
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not start payment");
    }
  }

  async function handleCancel() {
    try {
      setStatus("loading");
      await cancelSubscription();
      await loadUser();
      setStatus("success");
      setMessage("Subscription cancelled.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not cancel subscription");
    }
  }

  const isSubscribed = Boolean(user?.plan && user.plan !== "free" && user.subscriptionStatus === "active");
  const currentPlanLabel = user?.plan === "business"
    ? "Business Plan"
    : user?.plan
      ? `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)}`
      : "Free";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#06224C]">
        <CreditCard className="h-4 w-4" /> Subscription
      </h2>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Plan</p>
          <p className="mt-1 text-xl font-black capitalize text-[#06224C]">
            {currentPlanLabel} <span className="text-sm font-semibold text-slate-400">({user?.subscriptionStatus || "none"})</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Razorpay test is the primary payment provider.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleUpgrade()}
            disabled={status === "loading"}
            className="rounded-xl bg-[#06224C] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-900 disabled:opacity-60"
          >
            {status === "loading" ? "Processing..." : isSubscribed ? `Renew ${currentPlanLabel}` : "Upgrade"}
          </button>
          {isSubscribed && (
            <button
              type="button"
              onClick={() => void handleCancel()}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className={`mt-4 text-sm font-semibold ${status === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </section>
  );
}
