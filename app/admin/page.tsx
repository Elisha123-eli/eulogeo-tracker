"use client";
import { useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  full_name: string;
  institution: string;
  phone: string;
  weltrade_id: string | null;
  status: "started" | "pending" | "verified" | "rejected";
  created_at: string;
  completed_at: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  started: "text-mist",
  pending: "text-electric",
  verified: "text-profit",
  rejected: "text-loss",
};

export default function Admin() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(k: string) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin", { headers: { "x-admin-key": k } });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Access denied.");
      return;
    }
    sessionStorage.setItem("eulogeo_admin", k);
    setAuthed(true);
    setRows(data.rows);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("eulogeo_admin");
    if (saved) {
      setKey(saved);
      load(saved);
    }
  }, []);

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, status }),
    });
    load(key);
  }

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          !filter ||
          r.institution.toLowerCase().includes(filter.toLowerCase()) ||
          r.full_name.toLowerCase().includes(filter.toLowerCase()) ||
          (r.weltrade_id || "").includes(filter)
      ),
    [rows, filter]
  );

  const stats = useMemo(() => {
    const completed = rows.filter((r) => r.weltrade_id);
    const verified = rows.filter((r) => r.status === "verified");
    const byCampus: Record<string, number> = {};
    completed.forEach((r) => {
      const k = r.institution.trim();
      byCampus[k] = (byCampus[k] || 0) + 1;
    });
    const leaderboard = Object.entries(byCampus).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { total: rows.length, completed: completed.length, verified: verified.length, leaderboard };
  }, [rows]);

  function exportCsv() {
    const header = "Name,Institution,Phone,Weltrade ID,Status,Date Registered\n";
    const body = filtered
      .map((r) =>
        [r.full_name, r.institution, r.phone, r.weltrade_id || "", r.status, new Date(r.created_at).toLocaleString()]
          .map((v) => `\"${String(v).replace(/\"/g, '\"\"')}\"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `eulogeo-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="ticket w-full max-w-sm p-6 text-center">
          <p className="stage text-gold">EULOGEO · COMMAND DECK</p>
          <h1 className="mt-2 font-display text-xl font-bold">Admin access</h1>
          <input
            type="password"
            className="field mt-5"
            placeholder="Password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(key)}
          />
          {error && <p className="mt-2 text-sm text-loss">{error}</p>}
          <button className="btn-primary mt-4" onClick={() => load(key)} disabled={busy}>
            {busy ? "Checking…" : "Enter"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="stage text-gold">EULOGEO · COMMAND DECK</p>
          <h1 className="font-display text-2xl font-bold">Registration Tracker</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(key)} className="rounded-lg border border-edge px-4 py-2 text-sm text-mist hover:border-electric hover:text-electric">
            Refresh
          </button>
          <button onClick={exportCsv} className="rounded-lg border border-gold px-4 py-2 text-sm text-gold hover:bg-gold hover:text-obsidian">
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["STARTED THE FORM", stats.total],
          ["SUBMITTED WELTRADE ID", stats.completed],
          ["VERIFIED BY YOU", stats.verified],
        ].map(([label, value]) => (
          <div key={label as string} className="ticket p-5">
            <p className="stage text-mist">{label}</p>
            <p className="mt-1 font-mono text-3xl font-semibold text-electric">{value}</p>
          </div>
        ))}
      </div>

      {stats.leaderboard.length > 0 && (
        <div className="ticket mb-6 p-5">
          <p className="stage mb-3 text-mist">TOP CAMPUSES · BY COMPLETED REGISTRATIONS</p>
          <div className="space-y-2">
            {stats.leaderboard.map(([campus, n]) => (
              <div key={campus} className="flex items-center gap-3">
                <span className="w-40 truncate text-sm">{campus}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-edge">
                  <div
                    className="h-full bg-gradient-to-r from-electric to-gold"
                    style={{ width: `${(n / stats.leaderboard[0][1]) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-sm text-gold">{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        className="field mb-4 max-w-sm"
        placeholder="Filter by name, campus, or Weltrade ID…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="ticket overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="stage border-b border-edge text-mist">
              <th className="p-3">NAME</th>
              <th className="p-3">CAMPUS</th>
              <th className="p-3">PHONE</th>
              <th className="p-3">WELTRADE ID</th>
              <th className="p-3">DATE</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-edge/60 hover:bg-edge/20">
                <td className="p-3">{r.full_name}</td>
                <td className="p-3 text-mist">{r.institution}</td>
                <td className="p-3 font-mono text-xs">{r.phone}</td>
                <td className="p-3 font-mono text-electric">{r.weltrade_id || "—"}</td>
                <td className="p-3 text-xs text-mist">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className={`stage p-3 ${STATUS_COLOR[r.status]}`}>{r.status.toUpperCase()}</td>
                <td className="p-3">
                  {r.weltrade_id && r.status !== "verified" && (
                    <button onClick={() => setStatus(r.id, "verified")} className="mr-2 text-profit hover:underline">
                      Verify
                    </button>
                  )}
                  {r.weltrade_id && r.status !== "rejected" && (
                    <button onClick={() => setStatus(r.id, "rejected")} className="text-loss hover:underline">
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-mist">
                  No registrations yet. Share the funnel link to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
