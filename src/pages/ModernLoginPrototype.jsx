// Clinical Access Workspace: a visual-only login prototype. It intentionally makes no API call and does not alter the production LoginPage authentication flow.
import { useState } from 'react';
import { ArrowRight, Building2, CircleHelp, KeyRound, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';

export default function ModernLoginPrototype() {
  const [audience, setAudience] = useState('staff');
  const isStaff = audience === 'staff';
  return <main className="modern-login-demo">
    <header className="modern-login-topbar">
      <a className="modern-login-brand" href="/"><span><Building2 /></span><b>Hospital Management System</b></a>
      <div><i>SECURE WORKSPACE</i><span>Role-based access</span></div>
    </header>

    <section className="modern-login-workspace">
      <section className="modern-login-task">
        <div className="modern-login-breadcrumb"><span>ACCESS</span><i /> <b>Sign in</b></div>
        <h1>Sign in to your workspace.</h1>
        <p className="modern-login-intro">Use the account issued for your role and clinic. Your available tools are determined by approved permissions.</p>
        <div className="modern-login-switch" role="tablist" aria-label="Prototype access type">
          <button type="button" className={isStaff ? 'is-active' : ''} role="tab" aria-selected={isStaff} onClick={() => setAudience('staff')}><UserRound />Staff access</button>
          <button type="button" className={!isStaff ? 'is-active' : ''} role="tab" aria-selected={!isStaff} onClick={() => setAudience('patient')}><CircleHelp />Patient access</button>
        </div>
        <form className="modern-login-form" onSubmit={(event) => event.preventDefault()}>
          <label>Work email<input type="email" placeholder={isStaff ? 'name@hospital.com' : 'patient@email.com'} disabled /></label>
          <label>Password<div className="modern-password-field"><input type="password" placeholder="Enter your password" disabled /><LockKeyhole /></div></label>
          <div className="modern-login-options"><label><input type="checkbox" disabled />Remember this device</label><button type="button">Need help?</button></div>
          <button type="button" className="modern-login-primary">{isStaff ? 'Sign in to workspace' : 'Continue to patient access'}<ArrowRight /></button>
          <div className="modern-login-alternate"><span>or continue with</span><button type="button">Google</button></div>
        </form>
        <p className="modern-login-prototype-note">Visual prototype only — live authentication has not been changed.</p>
      </section>

      <aside className="modern-login-protocol" aria-label="Access protocol">
        <div className="modern-protocol-brandline"><span><KeyRound /></span><i>HOSPITAL ACCESS PROTOCOL</i></div>
        <h2>Built for focused care operations.</h2>
        <p>One secure sign-in connects approved staff to the records and workflows they need for the current clinic.</p>
        <dl>
          <div><dt><ShieldCheck /></dt><dd><b>Protected records</b><span>Access follows your assigned role.</span></dd></div>
          <div><dt><Building2 /></dt><dd><b>Clinic context</b><span>Work inside the authorized clinic scope.</span></dd></div>
          <div><dt><LockKeyhole /></dt><dd><b>Clear accountability</b><span>Sign-in is recorded for active sessions.</span></dd></div>
        </dl>
        <footer><span>Hospital Management System</span><i>v1 access interface</i></footer>
      </aside>
    </section>
  </main>;
}
