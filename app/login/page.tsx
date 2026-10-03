"use client";

import { useState } from "react";
import { ArrowLeft, Apple, Check, ChevronLeft, MessageCircle, Smartphone } from "lucide-react";
import Link from "next/link";

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

  const cleanPhone = phone.replace(/\D/g, "");

  function switchMode(next: Mode) {
    setMode(next); setStep("phone"); setOtp(""); setMessage("");
  }

  function continueToOtp() {
    setMessage("");
    if (mode === "signup" && !name.trim()) return setMessage("Please enter your name.");
    if (cleanPhone.length !== 10) return setMessage("Enter a valid 10-digit mobile number.");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("otp");
      setMessage(channel === "whatsapp"
        ? "Your verification code will be sent on WhatsApp."
        : "Your verification code will be sent by SMS.");
    }, 450);
  }

  function verifyOtp() {
    setMessage("");
    if (otp.replace(/\D/g, "").length !== 6) return setMessage("Enter the 6-digit OTP.");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setMessage("Phone verification is ready for provider connection. Connect your OTP service to activate live authentication.");
    }, 500);
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
          <label className="auth-field"><span>MOBILE NUMBER</span><div className="phone-field"><b>+91</b><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel"/></div></label>

          <div className="otp-channel-title"><span>GET OTP VIA</span></div>
          <div className="otp-channels">
            <button className={channel==="sms"?"selected":""} onClick={()=>setChannel("sms")}><Smartphone/><span><b>SMS</b><small>Text message</small></span>{channel==="sms"&&<Check/>}</button>
            <button className={channel==="whatsapp"?"selected":""} onClick={()=>setChannel("whatsapp")}><MessageCircle/><span><b>WhatsApp</b><small>Instant message</small></span>{channel==="whatsapp"&&<Check/>}</button>
          </div>

          {message&&<div className="auth-message">{message}</div>}
          <button className="auth-primary" onClick={continueToOtp} disabled={busy}>{busy?"PLEASE WAIT…":"CONTINUE →"}</button>

          <div className="auth-divider"><span>OR CONTINUE WITH</span></div>
          <div className="social-row"><button><span className="google-g">G</span> Google</button><button><Apple/> Apple</button></div>
          <p className="auth-legal">By continuing, you agree to Maison Aleri's Terms & Privacy Policy.</p>
        </> : <>
          <button className="auth-otp-back" onClick={()=>{setStep("phone");setOtp("");setMessage("")}}><ChevronLeft/> CHANGE NUMBER</button>
          <small className="auth-eyebrow">VERIFY YOUR NUMBER</small>
          <h2>Enter your OTP</h2>
          <p className="auth-intro">We've prepared a 6-digit verification code for <b>+91 {cleanPhone}</b> via {channel==="whatsapp"?"WhatsApp":"SMS"}.</p>
          <label className="auth-field"><span>6-DIGIT OTP</span><input className="otp-input" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="• • • • • •" inputMode="numeric" autoComplete="one-time-code" maxLength={6}/></label>
          {message&&<div className="auth-message">{message}</div>}
          <button className="auth-primary" onClick={verifyOtp} disabled={busy}>{busy?"VERIFYING…":"VERIFY & CONTINUE →"}</button>
          <button className="resend" onClick={continueToOtp}>RESEND CODE</button>
          <p className="auth-legal">New customers complete Sign Up before using Login. Your phone number is used only for account verification.</p>
        </>}
      </div>
      <div className="auth-footer">© 2026 MAISON ALERI · INDIA</div>
    </section>
  </main>
}