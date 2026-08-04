"use client";
import { useState } from "react";
import Link from "next/link";

type RegistrationData = {
  id: string;
  full_name: string;
  institution: string;
  phone: string;
  weltrade_id: string | null;
  status: "started" | "pending" | "verified" | "rejected";
  created_at: string;
  completed_at: string | null;
};

const STATUS_MESSAGES: Record<string, { title: string; message: string; color: string }> = {
  started: {
    title: "Registration Started",
    message: "Your registration is in progress. Please complete all steps to finalize your application.",
    color: "text-mist",
  },
  pending: {
    title: "Pending Review",
    message: "Your application is under review. We will notify you once a decision has been made.",
    color: "text-electric",
  },
  verified: {
    title: "Approved ✓",
    message: "Congratulations! Your application has been approved. Welcome to Eulogeo Trading Academy!",
    color: "text-profit",
  },
  rejected: {
    title: "Application Rejected",
    message: "Unfortunately, your application was not approved at this time. Please contact support for more information.",
    color: "text-loss",
  },
};

export default function StatusPage() {
  const [registrationId, setRegistrationId] = useState("");
  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkStatus() {
    setError("");
    setData(null);
    if (!registrationId.trim()) {
      setError("Please enter your registration ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: registrationId.trim() }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Registration not found.");
        return;
      }
      setData(result.data);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-10 pt-20">
      <div className="w-full max-w-md">
        <div className="rise mb-5">
          <div className="orbit-wrap">
            <div className="orbit orbit-blue" />
            <div className="orbit orbit-ember" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Eulogeo Trading Academy logo" />
          </div>
        </div>

        <div className="rise rise-1 mb-6 text-center">
          <p className="stage text-gold">EULOGEO TRADING ACADEMY</p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
            Check Your <span className="text-electric">Application Status</span>
          </h1>
          <div className="duo-rule mx-auto mt-4 w-28" />
        </div>

        {!data ? (
          <div className="ticket rise rise-3 p-6">
            <div className="space-y-4">
              <div>
                <label className="stage mb-1.5 block text-mist">REGISTRATION ID *</label>
                <p className="mb-2 text-xs text-mist">You received this ID when you completed your registration.</p>
                <input
                  className="field font-mono"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  onKeyDown={(e) => e.key === "Enter" && checkStatus()}
                />
              </div>
              {error && <p className="text-sm text-loss">{error}</p>}
              <button className="btn-primary" onClick={checkStatus} disabled={loading}>
                {loading ? "Checking…" : "Check Status →"}
              </button>
            </div>
            <div className="mt-6 border-t border-edge pt-4">
              <p className="text-center text-xs text-mist">
                Don&apos;t have your registration ID?{" "}
                <Link href="/" className="text-electric hover:underline">
                  Start fresh registration
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="ticket rise rise-3 p-6">
            <div className="space-y-5 text-center">
              <div
                className={`pulse-ok mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  data.status === "verified"
                    ? "bg-profit/15 text-3xl text-profit"
                    : data.status === "rejected"
                      ? "bg-loss/15 text-3xl text-loss"
                      : data.status === "pending"
                        ? "bg-electric/15 text-3xl text-electric"
                        : "bg-mist/15 text-3xl text-mist"
                }`}
              >
                {data.status === "verified"
                  ? "✓"
                  : data.status === "rejected"
                    ? "✗"
                    : data.status === "pending"
                      ? "⧖"
                      : "→"}
              </div>

              <div>
                <h2 className={`font-display text-xl font-bold ${STATUS_MESSAGES[data.status].color}`}>
                  {STATUS_MESSAGES[data.status].title}
                </h2>
                <p className="mt-3 text-sm text-mist">{STATUS_MESSAGES[data.status].message}</p>
              </div>

              <div className="duo-rule" />

              <div className="space-y-3 text-left">
                <div className="rounded-lg bg-edge/30 p-3">
                  <p className="stage mb-1 text-mist">FULL NAME</p>
                  <p className="text-sm font-semibold">{data.full_name}</p>
                </div>
                <div className="rounded-lg bg-edge/30 p-3">
                  <p className="stage mb-1 text-mist">INSTITUTION</p>
                  <p className="text-sm font-semibold">{data.institution}</p>
                </div>
                <div className="rounded-lg bg-edge/30 p-3">
                  <p className="stage mb-1 text-mist">WELTRADE ID</p>
                  <p className="font-mono text-sm text-electric">{data.weltrade_id || "Not yet submitted"}</p>
                </div>
                <div className="rounded-lg bg-edge/30 p-3">
                  <p className="stage mb-1 text-mist">REGISTERED ON</p>
                  <p className="text-sm">{new Date(data.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>

              {data.status === "verified" && (
                <div className="rounded-lg border border-profit bg-profit/5 p-4">
                  <p className="text-sm text-profit font-semibold">You are approved and ready to join the Eulogeo Trading Academy!</p>
                </div>
              )}

              {data.status === "rejected" && (
                <div className="rounded-lg border border-loss bg-loss/5 p-4">
                  <p className="text-sm text-loss">
                    If you believe this is a mistake, please contact support at{" "}
                    <a href="mailto:support@eulogeo.com" className="font-semibold hover:underline">
                      support@eulogeo.com
                    </a>
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setData(null);
                  setRegistrationId("");
                }}
                className="w-full rounded-lg border border-edge py-2.5 text-sm text-mist transition-colors hover:border-electric hover:text-electric"
              >
                Check Another ID
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-mist">
          © {new Date().getFullYear()} Eulogeo Trading Academy · Trade with discipline.
        </p>
      </div>
    </main>
  );
}
