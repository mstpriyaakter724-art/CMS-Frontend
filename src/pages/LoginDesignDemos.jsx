// Login Design Gallery: isolated visual prototypes only. Production sign-in, registration, API calls, and session behavior remain in LoginPage.jsx.
import { useState } from 'react';
import { Building2, ChevronRight, ClipboardCheck, KeyRound, ShieldCheck, Stethoscope } from 'lucide-react';

const demos = [
  { id: '1', name: 'Reception Console', summary: 'Bright, familiar and optimized for reception and daily administration.', tone: 'reception', icon: Building2, context: 'Front desk access', action: 'Sign in to reception workspace' },
  { id: '2', name: 'Clinical Command', summary: 'Deep-ink shift control with a focused white clinical work surface.', tone: 'command', icon: ShieldCheck, context: 'Clinical operations access', action: 'Enter clinical workspace' },
  { id: '3', name: 'Care Network', summary: 'Calm multi-clinic entry with clear staff and patient access boundaries.', tone: 'network', icon: Stethoscope, context: 'Clinic network access', action: 'Access clinic workspace' },
];

function DemoForm({ demo }) {
  return <div className="login-demo-form" aria-label={`${demo.name} visual prototype`}>
    <div className="login-demo-form-context"><span><KeyRound /> {demo.context}</span><i>Secure</i></div>
    <label>Work email<input placeholder="name@clinic.com" disabled /></label>
    <label>Password<input placeholder="••••••••" disabled /></label>
    <button type="button" className="login-demo-primary">{demo.action}<ChevronRight /></button>
    <div className="login-demo-divider"><span>or continue securely</span></div>
    <button type="button" className="login-demo-secondary">Google account</button>
  </div>;
}

export default function LoginDesignDemos() {
  const [selected, setSelected] = useState('');
  return <main className="login-demo-gallery">
    <header className="login-demo-gallery-header">
      <a href="/" className="login-demo-brand"><span><Building2 /></span><b>Hospital Management System</b></a>
      <div><p>LOGIN PAGE DESIGN DEMOS</p><h1>Select the access experience that fits your clinic.</h1><span>These are visual prototypes only. Your live sign-in and registration flows are unchanged.</span></div>
    </header>
    <section className="login-demo-grid">
      {demos.map((demo) => {
        const Icon = demo.icon;
        const active = selected === demo.id;
        return <article className={`login-demo-card ${demo.tone} ${active ? 'is-selected' : ''}`} key={demo.id}>
          <header><span className="login-demo-number">0{demo.id}</span><div><Icon /><strong>{demo.name}</strong></div><p>{demo.summary}</p></header>
          {demo.tone === 'reception' && <div className="demo-reception-layout"><aside><b>Northgate Clinic</b><span>Reception desk</span><i /><small>Patient registration</small><small>Appointments</small><small>Billing desk</small></aside><section><p>Welcome back</p><h2>Staff sign in</h2><DemoForm demo={demo} /></section></div>}
          {demo.tone === 'command' && <div className="demo-command-layout"><aside><span className="command-mark">+</span><b>Clinical Command</b><p>Authorized access to current shift operations.</p><div><small>RECORDS</small><strong>Protected</strong></div><div><small>AUTHORITY</small><strong>Role based</strong></div></aside><section><p>SHIFT ACCESS</p><h2>Open your workspace.</h2><DemoForm demo={demo} /></section></div>}
          {demo.tone === 'network' && <div className="demo-network-layout"><header><span><Stethoscope /></span><div><small>CARE NETWORK</small><b>Clinic operations</b></div><i>Staff</i></header><section><div className="network-context"><span>ACTIVE CLINIC</span><b>Choose authorized location</b><button type="button">Main clinic</button><button type="button">Branch operations</button></div><div><p>Secure staff access</p><h2>Start your work session.</h2><DemoForm demo={demo} /></div></section></div>}
          <footer><button type="button" onClick={() => setSelected(demo.id)}>{active ? 'Selected — tell us in chat' : `Select option ${demo.id}`}</button><span>{active ? `Option ${demo.id} is marked for your selection.` : 'Preview only'}</span></footer>
        </article>;
      })}
    </section>
    <aside className="login-demo-next">Select **1**, **2**, or **3** in chat. I will apply only your chosen direction to the real login page.</aside>
  </main>;
}
