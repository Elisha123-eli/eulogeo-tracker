"use client";
import { useState } from "react";

const STAGES = ["01 DETAILS", "02 EXECUTE", "03 CONFIRM"];

const QUOTES: [string, string][] = [
  ["An investment in knowledge pays the best interest.", "Benjamin Franklin"],
  ["Don't work for money — make money work for you.", "Eulogeo"],
  ["The best time to start was yesterday. The next best time is now.", "Proverb"],
  ["Discipline is the bridge between goals and profit.", "Eulogeo"],
  ["Every master trader was once a beginner who refused to quit.", "Eulogeo"],
  ["Small accounts grow on big habits.", "Eulogeo"],
  ["Plant seeds while you study — harvest while others sleep.", "Eulogeo"],
];

function Tape() {
  const items = [...QUOTES, ...QUOTES];
  return (
    <div className="tape" aria-hidden="true">
      <div className="tape-track">
        {items.map(([q, a], i) => (
          <span key={i}>
            <span className="bullet">▲</span>
            <span className="q">{q}</span>
            <span className="a">— {a}</span>
            <span className="mx-3 text-edge">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Funnel() {
  const [stage, setStage] = useState(0);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [phone, setPhone] = useState("");
  const [wtId, setWtId] = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [partnerLink, setPartnerLink] = useState("");
  const [telegram, setTelegram] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);

  async function startRegistration() {
    setError("");
    if (!name.trim() || !institution.trim() || !phone.trim()) {
      setError("All fields are required. Type “Personal” if you are not a student.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), institution: institution.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      setRecordId(data.id);
      setPartnerLink(data.partnerLink);
      setStage(1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmId() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId, weltradeId: wtId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not confirm your ID. Try again.");
      setTelegram(data.telegram);
      setStage(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(partnerLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copyId() {
    navigator.clipboard.writeText(recordId || "").then(() => {
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    });
  }

  return (
    <>
      <Tape />
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
              Your trading journey <span className="text-electric">starts here</span>.
            </h1>
            <div className="duo-rule mx-auto mt-4 w-28" />
          </div>

          <div className="rise rise-2 mb-5 flex items-center justify-between px-1">
            {STAGES.map((s, i) => (
              <span
                key={s}
                className={`stage transition-colors duration-300 ${
                  i === stage ? "text-electric" : i < stage ? "text-profit" : "text-mist"
                }`}
              >
                {i < stage ? "✓ " : ""}{s}
              </span>
            ))}
          </div>

          <div className="ticket rise rise-3 p-6">
            {stage === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="stage mb-1.5 block text-mist">FULL NAME *</label>
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chanda Mwansa" />
                </div>
                <div>
                  <label className="stage mb-1.5 block text-mist">UNIVERSITY / SCHOOL *</label>
                  <input className="field" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. UNZA — or type Personal" />
                  <p className="mt-1 text-xs text-mist">Not a student? Type <span className="text-gold">Personal</span>.</p>
                </div>
                <div>
                  <label className="stage mb-1.5 block text-mist">PHONE / WHATSAPP *</label>
                  <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0974 000 000" inputMode="tel" />
                </div>
                {error && <p className="text-sm text-loss">{error}</p>}
                <button className="btn-primary" onClick={startRegistration} disabled={busy}>
                  {busy ? "Opening your ticket…" : "Continue →"}
                </button>
              </div>
            )}

            {stage === 1 && (
              <div className="space-y-5 text-center">
                <p className="text-sm leading-relaxed text-mist">
                  Create your Weltrade account using the link or QR code below. After creating it,
                  enter your <span className="text-gold">Weltrade ID number</span> to unlock the
                  Eulogeo Trading Academy <span className="text-electric">free Telegram group</span>.
                </p>
                <div className="mx-auto w-fit rounded-xl bg-white p-3 shadow-[0_0_30px_rgba(45,156,255,0.2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=${encodeURIComponent(partnerLink)}`}
                    alt="Weltrade registration QR code" 
                    className="h-44 w-44"
                  />
                </div>
                <div className="space-y-2">
                  <a href={partnerLink} target="_blank" rel="noopener noreferrer" className="btn-primary block">
                    Open registration link
                  </a>
                  <button
                    onClick={copyLink}
                    className="w-full rounded-lg border border-edge py-2.5 text-sm text-mist transition-colors hover:border-electric hover:text-electric"
                  >
                    {copied ? "Link copied ✓" : "Copy link"}
                  </button>
                </div>
                <div className="duo-rule" />
                <div className="space-y-3 text-left">
                  <label className="stage block text-mist">YOUR WELTRADE ID *</label>
                  <input
                    className="field font-mono tracking-widest"
                    value={wtId}
                    onChange={(e) => setWtId(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 1336557"
                    inputMode="numeric"
                    maxLength={8}
                  />
                  {error && <p className="text-sm text-loss">{error}</p>}
                  <button className="btn-ember" onClick={confirmId} disabled={busy || wtId.length < 6}>
                    {busy ? "Confirming…" : "Unlock Telegram group 🔓"}
                  </button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="space-y-5 text-center">
                <div className="pulse-ok mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-profit/15 text-2xl text-profit">
                  ✓
                </div>
                <h2 className="font-display text-xl font-bold">Welcome to Eulogeo, {name.split(" ")[0]}.</h2>
                <p className="text-sm text-mist">
                  Your registration is recorded against Weltrade ID{" "}
                  <span className="font-mono text-gold">{wtId}</span>. Join the free group below —
                  your journey to disciplined trading begins today.
                </p>
                <a href={telegram} target="_blank" rel="noopener noreferrer" className="btn-ember block">
                  Join the Telegram group
                </a>
                
                <div className="duo-rule" />
                
                <div className="space-y-2 rounded-lg bg-edge/30 p-4">
                  <p className="stage text-mist">YOUR REGISTRATION ID</p>
                  <p className="break-all font-mono text-xs text-electric">{recordId}</p>
                  <button
                    onClick={copyId}
                    className="w-full rounded-lg border border-edge py-2 text-xs text-mist transition-colors hover:border-electric hover:text-electric"
                  >
                    {idCopied ? "ID copied ✓" : "Copy for later"}
                  </button>
                  <p className="text-xs text-mist">Save this ID to check your application status anytime at <a href="/status" className="text-electric hover:underline">/status</a></p>
                </div>

                <p className="text-xs italic text-mist">
                  "Discipline is the bridge between goals and profit."
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-mist">
            © {new Date().getFullYear()} Eulogeo Trading Academy · Trade with discipline.
          </p>
        </div>
      </main>
    </>
  );
}
