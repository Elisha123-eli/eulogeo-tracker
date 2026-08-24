"use client";

import { useRouter } from "next/navigation";

export function StartOver() {
  const router = useRouter();

  function resetRegistration() {
    localStorage.removeItem("eulogeo_registration");
    router.push("/register");
  }

  return (
    <button
      type="button"
      onClick={resetRegistration}
      className="rounded-lg border border-edge px-3 py-2 text-xs text-mist transition-colors hover:border-electric hover:text-electric"
      aria-label="Clear saved registration progress and start over"
    >
      Start over
    </button>
  );
}
