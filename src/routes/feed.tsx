import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from "react";

export const Route = createFileRoute('/feed')({
  component: Feed,
})

function Feed() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ handle?: string; email?: string } | null>(null,
  );

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
        .then((res) => {
            if (!res.ok) throw new Error("not logged in");
            return res.json();
        })
        .then(setMe)
        .catch(() => navigate({ to: "/" }));
  }, [navigate]);

async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    navigate({ to: "/" });
}

if (!me) return <p className="p-8 text-slate-100">Loading...</p>

return(
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <h1 className= "text-3xl font-semibold">
            Welcome, {me.handle ?? me.email}
        </h1>
        <p className ="mt-2  text-slate-400"> YOUR FEED WILL GO HERE.</p>
        <button type="button" onClick={logout} className="mt-6 underline">
            Log Out
        </button>
    </div>
);

}