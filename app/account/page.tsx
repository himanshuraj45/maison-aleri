"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return setLoading(false);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
  }, []);

  async function logout() {
    await supabase?.auth.signOut();
    window.location.href = "/";
  }

  if (loading) return <main className="account-page"><p>Loading your Maison Aleri account…</p></main>;
  if (!user) return <main className="account-page"><div><small>MAISON ALERI</small><h1>Your account awaits.</h1><p>Sign in to view your profile and orders.</p><Link href="/login" className="account-button">LOGIN / SIGN UP →</Link></div></main>;

  const name = user.user_metadata?.full_name || "Maison Aleri customer";
  return <main className="account-page">
    <Link href="/" className="account-back"><ArrowLeft/> BACK TO SHOP</Link>
    <section className="account-card">
      <small>MAISON ALERI · MY ACCOUNT</small>
      <h1>Hello, <em>{name}</em></h1>
      <p>{user.phone || user.email || "Verified account"}</p>
      <div className="account-grid">
        <div><span>PROFILE</span><b>{name}</b></div>
        <div><span>ACCOUNT</span><b>Verified</b></div>
      </div>
      <button onClick={logout} className="account-button"><LogOut/> SIGN OUT</button>
    </section>
  </main>;
}