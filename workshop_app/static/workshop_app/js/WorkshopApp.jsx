const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════════════════════════════
   SESSION HELPERS
 ═══════════════════════════════════════════════════════════════════════════ */
const SESSION_KEY  = "fossee_session";
const readSession  = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const writeSession = u  => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS (Formal Theme)
 ═══════════════════════════════════════════════════════════════════════════ */
const BRAND   = "#2563eb"; 
const SUCCESS = "#059669";
const DANGER  = "#dc2626";
const WARN    = "#d97706";
const MUTED   = "#64748b";
const BORDER  = "#e2e8f0";
const TEXT    = "#1e293b";

const CAT_IMAGE = {
  "Computer Science": "/static/workshop_app/img/python_hero.png",
  "Information Technology": "/static/workshop_app/img/it_hero.png",
  "Electronics": "/static/workshop_app/img/electronics_hero.png",
  "Mechanical Engineering": "/static/workshop_app/img/mechanical_hero.png",
  "Technical": "/static/workshop_app/img/mechanical_hero.png",
  "Core": "/static/workshop_app/img/python_hero.png",
};

const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"});

const WORKSHOPS   = window.DJANGO_WORKSHOPS || [];
const DEPARTMENTS = ["All Domains", ...new Set(WORKSHOPS.map(w => w.category))];

const DJANGO_AUTH_USER = (window.DJANGO_USER && typeof window.DJANGO_USER === 'object') ? window.DJANGO_USER : null;
if (DJANGO_AUTH_USER) writeSession(DJANGO_AUTH_USER);
else if (window.DJANGO_USER === null) clearSession();

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE (Dark Theme - Professional)
 ═══════════════════════════════════════════════════════════════════════════ */
function LandingPage({ user, onEnter }) {
  const stats = [
    { icon:"school", value:"12+", label:"Live Workshops" },
    { icon:"people", value:"2,400+", label:"Trained Students" },
    { icon:"account_balance", value:"IIT Bombay", label:"Host Institution" },
    { icon:"verified", value:"Certified", label:"Assessment Status" },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Inter',sans-serif",color:"#fff",position:"relative",overflowX:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:0.4,backgroundImage:"radial-gradient(#334155 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none"}}/>
      
      <div style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"100px 24px"}}>
        <div style={{textAlign:"center",marginBottom:80}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:4,padding:"6px 16px",fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:32,textTransform:"uppercase",letterSpacing:"0.1em"}}>
            Technical Capacity Building Program
          </div>
          <h1 style={{fontSize:"4rem",fontWeight:800,lineHeight:1.1,marginBottom:24,letterSpacing:"-0.03em"}}>
            FOSSEE Workshop Portal
          </h1>
          <p style={{fontSize:"1.25rem",color:"#94a3b8",maxWidth:700,margin:"0 auto 48px",lineHeight:1.6}}>
            Access high-quality training in Open Source Software, conducted by the FOSSEE project, IIT Bombay. 
          </p>
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            <button onClick={() => user ? onEnter() : window.location.href="/workshop/login/"}
              style={{background:BRAND,border:"none",color:"#fff",padding:"18px 44px",borderRadius:6,fontSize:16,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
              {user ? "Enter Discovery Center" : "Get Started"}
            </button>
            <button onClick={() => onEnter()}
              style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",padding:"18px 44px",borderRadius:6,fontSize:16,fontWeight:700,cursor:"pointer"}}>
              Browse Workshops
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:24}}>
          {stats.map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:32,textAlign:"center"}}>
              <span className="material-icons" style={{fontSize:32,color:BRAND,marginBottom:16}}>{s.icon}</span>
              <div style={{fontSize:28,fontWeight:800,marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WORKSHOP DASHBOARD COMPONENTS
 ═══════════════════════════════════════════════════════════════════════════ */
function SeatBar({ booked, seats }) {
  const pct=Math.round((booked/seats)*100), color=pct>=90?DANGER:pct>=65?WARN:SUCCESS, left=seats-booked;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12,color:TEXT}}>
        <span>{booked} / {seats} Enrolled</span>
        <span style={{fontWeight:700,color}}>{left===0?"FULL":`${left} Spots Left`}</span>
      </div>
      <div style={{height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3}}/>
      </div>
    </div>
  );
}

function WorkshopCard({ w, onBook }) {
  const [hov, setHov] = useState(false);
  const full=w.booked>=w.seats, image=CAT_IMAGE[w.category]||CAT_IMAGE["Core"];
  return (
    <div onClick={()=>!full&&onBook(w)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"#fff",border:`1px solid ${hov?BRAND:BORDER}`,borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column",cursor:full?"default":"pointer",transition:"all .2s",boxShadow:hov?"0 12px 24px -10px rgba(0,0,0,0.15)":"none"}}>
      <div style={{height:200,overflow:"hidden"}}><img src={image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
      <div style={{padding:"24px",flex:1,display:"flex",flexDirection:"column",gap:16}}>
        <div><div style={{fontSize:11,fontWeight:800,color:BRAND,textTransform:"uppercase",marginBottom:4}}>{w.category}</div><h3 style={{margin:0,fontSize:18,fontWeight:800,color:TEXT,lineHeight:1.3}}>{w.title}</h3></div>
        <p style={{margin:0,fontSize:14,color:MUTED,lineHeight:1.6,flex:1}}>{w.description}</p>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:MUTED,borderTop:`1px solid ${BORDER}`,paddingTop:16}}><span className="material-icons" style={{fontSize:18}}>history</span>{w.duration}</div>
        <SeatBar booked={w.booked} seats={w.seats}/>
        <button onClick={e=>{e.stopPropagation();!full&&onBook(w);}} disabled={full} style={{width:"100%",padding:"12px",border:"none",borderRadius:4,background:full?"#cbd5e1":BRAND,color:"#fff",fontWeight:700,cursor:full?"not-allowed":"pointer"}}>
          {full?"REGISTRATION CLOSED":"RESERVE SEAT"}
        </button>
      </div>
    </div>
  );
}

function GuestAlertModal({ onSignIn, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:8,maxWidth:440,width:"100%",padding:"48px",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:64,height:64,background:"#fef2f2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><span className="material-icons" style={{fontSize:32,color:DANGER}}>lock</span></div>
        <h3 style={{fontSize:24,fontWeight:800,color:TEXT,marginBottom:12}}>Identity Required</h3>
        <p style={{fontSize:16,color:MUTED,marginBottom:32,lineHeight:1.6}}>You must <strong>sign in first</strong> to formalize your workshop reservation.</p>
        <button onClick={onSignIn} style={{width:"100%",padding:"14px",background:BRAND,color:"#fff",border:"none",borderRadius:6,fontWeight:700,cursor:"pointer",marginBottom:12}}>Sign In to Continue</button>
        <button onClick={onClose} style={{background:"none",border:"none",color:MUTED,fontWeight:600,cursor:"pointer"}}>Return to Browsing</button>
      </div>
    </div>
  );
}

function BookingModal({ w, user, onClose, onConfirm }) {
  const [step,setStep]=useState(1), [date,setDate]=useState(""), [conds,setConds]=useState({c1:false,c2:false,c3:false});
  if (!w || !user) return null;
  const allOk=conds.c1&&conds.c2&&conds.c3&&date;
  const Btn=({label,bg,onClick,disabled=false})=><button onClick={onClick} disabled={disabled} style={{flex:1,padding:"12px 0",border:"none",borderRadius:4,background:disabled?"#e2e8f0":bg,color:"#fff",fontWeight:700,cursor:disabled?"not-allowed":"pointer"}}>{label}</button>;
  
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1400,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:540,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:"#1e293b",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#fff"}}><h2 style={{margin:0,fontSize:18,fontWeight:700}}>Session Booking</h2><button onClick={onClose} style={{background:"none",border:"none",color:"#94a3b8",fontSize:24,cursor:"pointer"}}>×</button></div>
        <div style={{padding:"40px"}}>
          {step===1&&(
            <div style={{color:TEXT}}><h4 style={{marginBottom:8,fontWeight:800}}>Step 1: Identity Check</h4><p style={{marginBottom:32,fontSize:15,color:MUTED}}>Verify your session details for {w.title}.</p>
              <table style={{width:"100%",fontSize:15,borderCollapse:"collapse",marginBottom:32}}><tbody>{[["Full Name",user.name],["Email Address",user.email],["Institutional Body",user.institute]].map(([k,v])=>(<tr key={k} style={{borderBottom:`1px solid ${BORDER}`}}><td style={{padding:"14px 0",color:MUTED,width:"40%"}}>{k}</td><td style={{padding:"14px 0",fontWeight:700}}>{v||"Guest Student"}</td></tr>))}</tbody></table>
              <Btn label="Proceed to Batch Selection" bg={BRAND} onClick={()=>setStep(2)}/>
            </div>
          )}
          {step===2&&(
            <div style={{color:TEXT}}><h4 style={{marginBottom:16,fontWeight:800}}>Step 2: Batch Selection</h4><p style={{marginBottom:24,fontSize:15,color:MUTED}}>Available workshop batches:</p>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>{w.available.map(d=>(<label key={d} style={{display:"flex",alignItems:"center",gap:16,padding:"18px",borderRadius:8,border:`1px solid ${date===d?BRAND:BORDER}`,background:date===d?"#f0f9ff":"#fff",cursor:"pointer"}}><input type="radio" checked={date===d} onChange={()=>setDate(d)} style={{width:20,height:20}}/><span style={{fontSize:16,fontWeight:700,color:TEXT}}>{fmtDate(d)}</span></label>))}</div>
              <div style={{display:"flex",gap:12}}><button onClick={()=>setStep(1)} style={{flex:1,padding:"12px",background:"#fff",border:`1px solid ${BORDER}`,borderRadius:4,fontWeight:700,color:TEXT,cursor:"pointer"}}>Back</button><Btn label="Final Confirmation" bg={BRAND} onClick={()=>setStep(3)} disabled={!date}/></div>
            </div>
          )}
          {step===3&&(
            <div style={{color:TEXT}}><h4 style={{marginBottom:24,fontWeight:800}}>Step 3: Declaration</h4>
              <div style={{background:"#f8fafc",border:`1px solid ${BORDER}`,padding:20,borderRadius:8,marginBottom:32}}><div style={{fontSize:12,color:MUTED,textTransform:"uppercase",fontWeight:800,marginBottom:6}}>Summary</div><div style={{fontSize:16,fontWeight:800,marginBottom:2}}>{w.title}</div><div style={{fontSize:15,fontWeight:700,color:BRAND}}>{fmtDate(date)}</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:32}}>{["Declaration of institutional enrollment","Agree to technical compliance standards","Permission to generate certificate"].map((t,i)=>(<label key={i} style={{display:"flex",alignItems:"flex-start",gap:14,fontSize:14,cursor:"pointer",lineHeight:1.5}}><input type="checkbox" checked={conds[`c${i+1}`]} onChange={e=>setConds(c=>({...c,[`c${i+1}`]:e.target.checked}))} style={{marginTop:4}}/><span>{t}</span></label>))}</div>
              <div style={{display:"flex",gap:12}}><button onClick={()=>setStep(2)} style={{flex:1,padding:"12px",background:"#fff",border:`1px solid ${BORDER}`,borderRadius:4,fontWeight:700,color:TEXT,cursor:"pointer"}}>Back</button><Btn label="Confirm & Book" bg={SUCCESS} onClick={()=>allOk&&onConfirm(w,date)} disabled={!allOk}/></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
 ═══════════════════════════════════════════════════════════════════════════ */
function WorkshopsDashboard({ user }) {
  const [page,setPage]=useState("workshops"), [filter,setFilter]=useState("All Domains"), [search,setSearch]=useState(""), [booking,setBooking]=useState(null), [success,setSuccess]=useState(null), [bookings,setBookings]=useState([]), [showAuthAlert, setShowAuthAlert]=useState(false);
  const filtered=WORKSHOPS.filter(w=>(filter==="All Domains"||w.category===filter)&&(w.title.toLowerCase().includes(search.toLowerCase())));
  const handleBookClick = (w) => { if(!user) setShowAuthAlert(true); else setBooking(w); };

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#f8fafc",minHeight:"100vh"}}>
      <header style={{background:"#fff",borderBottom:`1px solid ${BORDER}`,height:64}}><div style={{maxWidth:1200,margin:"0 auto",height:"100%",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:40}}><img src="/static/workshop_app/img/fossee_logo.png" style={{height:28}} alt="FOSSEE"/>
            <nav style={{display:"flex",gap:24}}>{["Workshops","Reservations"].map(l=>{const active = page===(l==="Workshops"?"workshops":"my-bookings");return <button key={l} onClick={()=>setPage(l==="Workshops"?"workshops":"my-bookings")} style={{background:"none",border:"none",height:64,fontSize:14,fontWeight:700,color:active?BRAND:MUTED,borderBottom:active?`2px solid ${BRAND}`:"2px solid transparent",cursor:"pointer"}}>{l}</button>;})}</nav>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>{user ? (<div style={{display:"flex",alignItems:"center",gap:16}}><div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:TEXT}}>{user.name}</div><div style={{fontSize:11,color:MUTED}}>Authenticated</div></div><button onClick={()=>window.location.href="/workshop/logout/"} style={{border:`1px solid ${BORDER}`,background:"#fff",padding:"8px 16px",borderRadius:4,fontSize:13,fontWeight:700,cursor:"pointer"}}>Logout</button></div>) : <button onClick={()=>window.location.href="/workshop/login/"} style={{background:BRAND,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontSize:13,fontWeight:800,cursor:"pointer"}}>Sign In</button>}</div>
        </div></header>
      <main style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px"}}>
        {page==="workshops" ? (<div><div style={{marginBottom:48}}><h1 style={{fontSize:36,fontWeight:900,color:TEXT,letterSpacing:"-0.02em"}}>Workshop Discovery</h1><p style={{fontSize:17,color:MUTED,marginTop:8}}>Professional capacity building sessions from the FOSSEE project, IIT Bombay.</p></div>
            <div style={{background:"#fff",padding:"24px",borderRadius:6,border:`1px solid ${BORDER}`,display:"flex",gap:16,marginBottom:40}}><input type="text" placeholder="Search sessions..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,padding:"12px 16px",border:`1px solid ${BORDER}`,borderRadius:4,fontSize:15}}/><select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"0 20px",border:`1px solid ${BORDER}`,borderRadius:4,background:"#fff"}}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(350px,1fr))",gap:32}}>{filtered.map(w=><WorkshopCard key={w.id} w={w} onBook={handleBookClick}/>)}</div></div>
        ) : (<div><h2 style={{fontSize:28,fontWeight:900,color:TEXT,marginBottom:32}}>My Activity</h2>{bookings.length===0 ? <div style={{textAlign:"center",padding:"120px 24px",background:"#fff",border:`1px solid ${BORDER}`,borderRadius:8,color:MUTED}}><span className="material-icons" style={{fontSize:56,marginBottom:20,display:"block",color:"#e2e8f0"}}>event_available</span>No active registrations found.</div> : (<div style={{display:"grid",gap:20}}>{bookings.map((b,i)=>(<div key={i} style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontSize:18,fontWeight:800,color:TEXT,marginBottom:4}}>{b.workshop.title}</div><div style={{fontSize:15,color:MUTED}}>{fmtDate(b.date)} batch</div></div><div style={{fontSize:11,fontWeight:900,color:WARN,background:`${WARN}10`,border:`1px solid ${WARN}25`,padding:"8px 16px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Pending Review</div></div>))}</div>)}</div>)}
      </main>
      {showAuthAlert&&<GuestAlertModal onSignIn={()=>window.location.href="/workshop/login/"} onClose={()=>setShowAuthAlert(false)}/>}
      {booking&&<BookingModal w={booking} user={user} onClose={()=>setBooking(null)} onConfirm={(w,d)=>{setBookings(b=>[...b,{workshop:w,date:d}]);setBooking(null);setSuccess({workshop:w});}}/>}
      {success&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1600,backdropFilter:"blur(5px)"}}><div style={{background:"#fff",borderRadius:8,maxWidth:480,width:"100%",padding:"48px",textAlign:"center"}}><span className="material-icons" style={{fontSize:72,color:SUCCESS,marginBottom:28,display:"block"}}>task_alt</span><h3 style={{fontSize:26,fontWeight:900,color:TEXT,marginBottom:16}}>Booking Request Sent</h3><p style={{fontSize:17,color:MUTED,lineHeight:1.6,marginBottom:40}}>Your registration for <strong>{success.workshop.title}</strong> has been submitted. Check your status in the reservations tab.</p><button onClick={()=>setSuccess(null)} style={{width:"100%",padding:"14px",background:BRAND,color:"#fff",border:"none",borderRadius:6,fontWeight:800,cursor:"pointer",transition:"transform .1s active:scale(0.98)"}}>Continue Browsing</button></div></div>
      )}
    </div>
  );
}

function WorkshopApp() {
  const [user, setUser] = useState(() => {
    if (window.DJANGO_USER && typeof window.DJANGO_USER === 'object') return window.DJANGO_USER;
    if (window.DJANGO_USER === null) { clearSession(); return null; }
    return readSession();
  });
  const [screen, setScreen] = useState(() => {
    if (window.location.pathname.includes("/discovery")) return "dashboard";
    if (user) return "dashboard";
    return (window.DJANGO_START_SCREEN === "dashboard") ? "dashboard" : "landing";
  });

  useEffect(() => {
    if (DJANGO_AUTH_USER) {
      setUser(DJANGO_AUTH_USER);
      setScreen("dashboard");
    }
  }, []);

  if (screen === "landing" && !user) return <LandingPage user={user} onEnter={()=>setScreen("dashboard")}/>;
  return <WorkshopsDashboard user={user}/>;
}

const root = ReactDOM.createRoot(document.getElementById('workshop-app-root'));
root.render(<WorkshopApp />);
