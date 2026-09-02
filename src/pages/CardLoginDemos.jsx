// Card Login Demos: visual-only clinic access options. They never submit data or modify production LoginPage authentication behavior.
import { useState } from 'react';
import { ArrowRight, Building2, ClipboardCheck, LockKeyhole, ShieldCheck, Stethoscope } from 'lucide-react';

const options = [
  { id: 1, key: 'essential', title: 'Essential Care', label: 'THE CLEAN STAFF LOGIN', text: 'A bright clinical card with the fewest possible decisions.', icon: ShieldCheck },
  { id: 2, key: 'night', title: 'Night Shift', label: '24-HOUR OPERATIONS', text: 'A focused dark system field with a clear white access card.', icon: LockKeyhole },
  { id: 3, key: 'ledger', title: 'Green Ledger', label: 'CLINIC NETWORK ACCESS', text: 'A calm sage surface with branch-aware access context.', icon: Stethoscope },
  { id: 4, key: 'clearline', title: 'Clearline', label: 'MODERN OPERATIONS', text: 'A crisp, structured card with a contemporary service feel.', icon: ClipboardCheck },
];

function LoginCard({ title, tone, compact = false }) {
  return <section className={`card-demo-login-card ${tone} ${compact ? 'is-compact' : ''}`}>
    <div className="card-demo-card-top"><span><LockKeyhole /> Secure sign in</span><i>Staff</i></div>
    <h3>{title}</h3>
    <p>Use your authorized clinic account.</p>
    <label>Email address<input disabled placeholder="name@clinic.com" /></label>
    <label>Password<input disabled placeholder="Enter password" type="password" /></label>
    <button type="button" className="card-demo-primary">Sign in <ArrowRight /></button>
    <div className="card-demo-or"><span>or</span></div>
    <button type="button" className="card-demo-google">Continue with Google</button>
  </section>;
}

function EssentialDemo() { return <div className="card-demo-scene essential-scene"><div className="essential-identity"><span><Building2 /></span><div><b>Northgate Clinic</b><small>Hospital Management System</small></div></div><LoginCard tone="essential" title="Welcome back" /><aside><ShieldCheck /><b>Role-based workspace</b><span>Your account opens only the tools approved for your role.</span></aside></div>; }
function NightDemo() { return <div className="card-demo-scene night-scene"><header><span>MEDICAL OPERATIONS</span><b>Night shift access</b><i>Online</i></header><div className="night-console"><aside><span>+</span><b>Care begins with a controlled record.</b><p>Secure access for active clinical roles.</p><small>AUTHORIZED STAFF ONLY</small></aside><LoginCard tone="night" title="Access workspace" /></div></div>; }
function LedgerDemo() { return <div className="card-demo-scene ledger-scene"><header><span><Stethoscope /></span><b>Clinic Network</b><i>3 locations</i></header><section><aside><small>ACTIVE CONTEXT</small><b>Main Clinic</b><span>Outpatient & diagnostics</span><button type="button">Change location</button></aside><LoginCard tone="ledger" title="Staff sign in" /></section></div>; }
function ClearlineDemo() { return <div className="card-demo-scene clearline-scene"><header><span><ClipboardCheck /></span><div><small>HOSPITAL SYSTEM</small><b>Clearline workspace</b></div></header><section><LoginCard tone="clearline" title="Sign in to continue" compact /><aside><span>ACCESS CHECK</span><div><i>01</i><b>Verified identity</b></div><div><i>02</i><b>Assigned clinic</b></div><div><i>03</i><b>Role permissions</b></div></aside></section></div>; }

export default function CardLoginDemos() {
  const [selected, setSelected] = useState(null);
  return <main className="card-login-gallery">
    <header className="card-demo-header"><a href="/"><span><Building2 /></span>Hospital Management System</a><div><p>MODERN CARD-BASED LOGIN DEMOS</p><h1>Choose a login card that feels right for your clinic.</h1><span>All samples are visual prototypes. The real login form and account workflow remain untouched.</span></div></header>
    <section className="card-demo-grid">{options.map((option) => { const Icon = option.icon; return <article className={`card-demo-option option-${option.key} ${selected === option.id ? 'is-selected' : ''}`} key={option.id}><header><span>0{option.id}</span><div><Icon /><b>{option.title}</b></div><small>{option.label}</small><p>{option.text}</p></header>{option.key === 'essential' ? <EssentialDemo /> : option.key === 'night' ? <NightDemo /> : option.key === 'ledger' ? <LedgerDemo /> : <ClearlineDemo />}<footer><button type="button" onClick={() => setSelected(option.id)}>{selected === option.id ? 'Selected — tell us in chat' : `Choose design ${option.id}`}</button><span>{selected === option.id ? 'Marked for production direction' : 'Visual demo only'}</span></footer></article>; })}</section>
    <p className="card-demo-selection-note">After viewing the cards, send **1**, **2**, **3**, or **4** in chat. I will apply only that visual direction to the actual login page.</p>
  </main>;
}
