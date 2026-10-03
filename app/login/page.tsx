"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Apple, Check, ChevronLeft, MessageCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Mode = "login" | "signup";
type Step = "phone" | "otp";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("phone");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const cleanPhone = phone.replace(/D/g, "");
  const e164 = cleanPhone ? `+91${cleanPhone}` : "";

  useEffect(() => {
    if (typeof window === "undefined" || !supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) window.location.href = "/";
    });
    return () => data.subscription.unsubscribe();
  }, []);

  function switchMode(next: Mode) {
    setMode(next); setStep("phone"); setOtp(""); setMessage("");
  }

  async function continueToOtp() {
    setMessage("");
    if (!supabase) return setMessage("Authentication is not configured yet. Add the Supabase variables to .env.local.");
    if (mode === "signup" && !name.trim()) return setMessage("Please enter your name.");
    if (cleanPhone.length !== 10) return setMessage("Enter a valid 10-digit mobile number.");
    if (channel === "whatsapp") {
      return setMessage("WhatsApp OTP needs the Twilio Verify bridge configured. SMS OTP is ready with Supabase.");
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: e164,
      options: {
        shouldCreateUser: mode === "signup",
        data: mode === "signup" ? { full_name: name.trim() } : undefined,
      },
    });
    setBusy(false);
    if (error) return setMessage(error.message);
    setStep("otp");
    setMessage(`A 6-digit verification code was sent by SMS to ${e164}.`);
  }

  async function verifyOtp() {
    setMessage("");
    if (!supabase) return setMessage("Authentication is not configured yet.");
    if (otp.length !== 6) return setMessage("Enter the 6-digit OTP.");
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ phone: e164, token: otp, type: "sms" });
    setBusy(false);
    if (error) return setMessage(error.message);
    window.location.href = "/";
  }

  async function social(provider: "google" | "apple") {
    setMessage("");
    if (!supabase) return setMessage("Authentication is not configured yet. Add the Supabase variables to .env.local.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/login" },
    });
    if (error) setMessage(error.message);
  }

  return <main className="auth-page">
    <div className="auth-visual">
      <div className="auth-visual-shade"/>
      <Link href="/" className="auth-back"><ArrowLeft/> BACK TO MAISON ALERI</Link>
      <div className="auth-brand">MAISON <i>ALERI</i></div>
      <div className="auth-quote"><small>THE ALERI EDIT</small><h1>Welcome to<br/><em>your wardrobe.</em></h1><p>Private edits, new drops and a more personal Maison Aleri experience.</p></div>
    </div>

    <section className="auth-panel">
      <div className="auth-mobile-brand">MAISON <i>ALERI</i></div>
      <div className="auth-tabs">
        <button className={mode==="login"?"active":""} onClick={()=>switchMode("login")}>LOGIN</button>
        <button className={mode==="signup"?"active":""} onClick={()=>switchMode("signup")}>SIGN UP</button>
      </div>

      <div className="auth-content">
        {step === "phone" ? <>
          <small className="auth-eyebrow">{mode==="login"?"WELCOME BACK":"CREATE YOUR ACCOUNT"}</small>
          <h2>{mode==="login"?"Sign in to Maison Aleri":"Join Maison Aleri"}</h2>
          <p className="auth-intro">{mode==="login"?"Use your mobile number to access your account.":"Create your Maison Aleri account with your name and mobile number."}</p>

          {mode==="signup" && <label className="auth-field"><span>FULL NAME</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label>}
          <label className="auth-field"><span>MOBILE NUMBER</span><div className="phone-field"><b>+91</b><input value={phone} onChange={e=>setPhone(e.target.value.replace(/D/g,"").slice(0,10))} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel"/></div></label>

          <div className="otp-channel-title"><span>GET OTP VIA</span></div>
          <div className="otp-channels">
            <button className={channel==="sms"?"selected":""} onClick={()=>setChannel("sms")}><Smartphone/><span><b>SMS</b><small>Text message</small></span>{channel==="sms"&&<Check/>}</button>
            <button className={channel==="whatsapp"?"selected":""} onClick={()=>setChannel("whatsapp")}><MessageCircle/><span><b>WhatsApp</b><small>Requires WhatsApp provider</small></span>{channel==="whatsapp"&&<Check/>}</button>
          </div>

          {message&&<div className="auth-message">{message}</div>}
          <button className="auth-primary" onClick={continueToOtp} disabled={busy}>{busy?"SENDING OTP…":"CONTINUE →"}</button>

          <div className="auth-divider"><span>OR CONTINUE WITH</span></div>
          <div className="social-row"><button onClick={()=>social("google")}><span className="google-g">G</span> Google</button><button onClick={()=>social("apple")}><Apple/> Apple</button></div>
          <p className="auth-legal">By continuing, you agree to Maison Aleri's Terms & Privacy Policy.</p>
        </> : <>
          <button className="auth-otp-back" onClick={()=>{setStep("phone");setOtp("");setMessage("")}}><ChevronLeft/> CHANGE NUMBER</button>
          <small className="auth-eyebrow">VERIFY YOUR NUMBER</small>
          <h2>Enter your OTP</h2>
          <p className="auth-intro">Enter the 6-digit verification code sent to <b>{e164}</b> by SMS.</p>
          <label className="auth-field"><span>6-DIGIT OTP</span><input className="otp-input" value={otp} onChange={e=>setOtp(e.target.value.replace(/D/g,"").slice(0,6))} placeholder="• • • • • •" inputMode="numeric" autoComplete="one-time-code" maxLength={6}/></label>
          {message&&<div className="auth-message">{message}</div>}
          <button className="auth-primary" onClick={verifyOtp} disabled={busy}>{busy?"VERIFYING…":"VERIFY & CONTINUE →"}</button>
          <button className="resend" onClick={continueToOtp} disabled={busy}>RESEND CODE</button>
          <p className="auth-legal">New customers complete Sign Up before using Login. Your phone number is used only for account verification.</p>
        </>}
      </div>
      <div className="auth-footer">© 2026 MAISON ALERI · INDIA</div>
    </section>
  </main>
}