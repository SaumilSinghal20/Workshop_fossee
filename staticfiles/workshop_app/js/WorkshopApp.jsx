const { useState } = React;

const BRAND   = "#1a1d2e";
const ACCENT  = "#4f6ef7";
const SUCCESS = "#22c55e";
const DANGER  = "#ef4444";
const WARN    = "#f59e0b";
const MUTED   = "#6b7280";

const CAT_IMAGE = {
  "Computer Science":       "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600",
  "Information Technology": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600",
  "Electronics":            "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600",
  "Mechanical Engineering": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600",
  "Electrical Engineering": "https://images.unsplash.com/photo-1454165833767-027ffea9e67a?q=80&w=600",
  "Biosciences":            "https://images.unsplash.com/photo-1532187863486-abf9bdad1b4c?q=80&w=600",
  "Technical":              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600",
  "Core":                   "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600",
};

const CAT_ICON = {
  "Computer Science":       "code",
  "Information Technology": "language",
  "Electronics":            "memory",
  "Mechanical Engineering": "precision_manufacturing",
  "Electrical Engineering": "bolt",
  "Biosciences":            "biotech",
  "Technical":              "build",
  "Core":                   "school",
};

const LEVEL_COLOR = { Beginner: SUCCESS, Intermediate: WARN, Advanced: DANGER };

const MOCK_WORKSHOPS = [
  {
    id:1, title:"Mastering Python for Data Science",
    category:"Computer Science", duration:"Join us for 3 intense, rewarding days",
    instructor:"Dr. Ananya Sharma",
    available:["2026-05-10","2026-05-24","2026-06-07"],
    seats:60, booked:43, level:"Intermediate",
    description:"Elevate your data skills. We'll dive deep into NumPy, Pandas, and Scikit-learn, transforming raw data into meaningful insights. It's not just about code; it's about telling a story with data that drives real change.",
  },
  {
    id:2, title:"Full-Stack Journey with Django",
    category:"Information Technology", duration:"2 days of hands-on building",
    instructor:"Prof. Rajan Mehta",
    available:["2026-05-15","2026-06-01","2026-06-20"],
    seats:50, booked:21, level:"Beginner",
    description:"Ever wanted to build your own web application from scratch? This weekend, we'll do exactly that. We'll guide you through every step of Django, from the first line of code to a live, breathing application.",
  },
  {
    id:3, title:"Hands-on IoT & Embedded Systems",
    category:"Electronics", duration:"3 days of physical prototyping",
    instructor:"Dr. Priya Nair",
    available:["2026-05-20","2026-06-10"],
    seats:40, booked:38, level:"Advanced",
    description:"Bring your ideas to life. We'll bridge the gap between software and the physical world. You'll work with real hardware, sensors, and cloud telemetry, leaving with a prototype you actually built yourself.",
  },
  {
    id:4, title:"Fluid Dynamics with OpenFOAM",
    category:"Mechanical Engineering", duration:"4 days of simulation mastery",
    instructor:"Prof. Aditya Kulkarni",
    available:["2026-06-05","2026-06-25"],
    seats:35, booked:12, level:"Advanced",
    description:"Master the art of computational fluid dynamics. Using OpenFOAM, we'll explore geometry, meshing, and solver configuration. It's a deep dive into the industry-standard toolkit for engineering excellence.",
  },
  {
    id:5, title:"Modern VLSI Design Flow",
    category:"Electrical Engineering", duration:"2 days of silicon innovation",
    instructor:"Dr. Kavitha Iyer",
    available:["2026-05-28","2026-06-18"],
    seats:45, booked:30, level:"Intermediate",
    description:"Step into the world of semiconductor design. We'll walk through the complete ASIC flow, from RTL to final layout. Experience the thrill of designing hardware using high-end open-source EDA tools.",
  },
  {
    id:6, title:"Bioinformatics Essentials with R",
    category:"Biosciences", duration:"2 days of genomic exploration",
    instructor:"Dr. Sneha Reddy",
    available:["2026-06-12","2026-07-02"],
    seats:30, booked:8, level:"Beginner",
    description:"Unlock the secrets of the genome. We'll use R and Bioconductor to analyze complex biological datasets. By the end, you'll be producing publication-ready visualizations and gene expression profiles.",
  },
];

const WORKSHOPS = (window.DJANGO_WORKSHOPS && window.DJANGO_WORKSHOPS.length > 0)
  ? window.DJANGO_WORKSHOPS
  : MOCK_WORKSHOPS;

const DEPARTMENTS = ["All", ...new Set(WORKSHOPS.map(w => w.category))];

const MOCK_USER = window.DJANGO_USER || {
  name:"Guest User", email:"guest@example.com",
  institute:"IIT Bombay", department:"General", position:"Guest",
};

const fmtDate = d =>
  new Date(d).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"});

function Badge({ label, bg, small=false }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      gap:4, fontSize: small ? 10 : 11, fontWeight:600,
      color:"#fff", background:bg, borderRadius:20,
      padding: small ? "2px 7px" : "3px 9px",
      letterSpacing:"0.02em",
    }}>
      {label}
    </span>
  );
}

function SeatBar({ booked, seats }) {
  const pct   = Math.round((booked / seats) * 100);
  const color = pct >= 90 ? DANGER : pct >= 65 ? WARN : SUCCESS;
  const left  = seats - booked;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:12,color:MUTED}}>{booked}/{seats} enrolled</span>
        <span style={{fontSize:12,fontWeight:700,color}}>
          {left === 0 ? "Full" : `${left} seat${left !== 1 ? "s" : ""} left`}
        </span>
      </div>
      <div style={{height:7,background:"#e5e7eb",borderRadius:99,overflow:"hidden",position:"relative"}}>
        <div style={{
          width:`${pct}%`, height:"100%", background:color,
          borderRadius:99, transition:"width .5s ease",
        }}/>
      </div>
      <div style={{textAlign:"right",fontSize:10,color:MUTED,marginTop:3}}>{pct}% filled</div>
    </div>
  );
}

function WorkshopCard({ w, onBook }) {
  const [hovered, setHovered] = useState(false);
  const full = w.booked >= w.seats;
  const image    = CAT_IMAGE[w.category] || CAT_IMAGE["Core"];
  const icon     = CAT_ICON[w.category] || "school";
  const levelColor = LEVEL_COLOR[w.level] || SUCCESS;

  return (
    <div
      onClick={() => !full && onBook(w)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#fff",
        borderRadius:16,
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
        cursor: full ? "default" : "pointer",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,.18)"
          : "0 4px 15px rgba(0,0,0,.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition:"all .4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        border:"1px solid #f0f0f0",
      }}
    >
      <div style={{
        height:180,
        position:"relative",
        overflow:"hidden",
      }}>
        <img 
          src={image} 
          alt={w.title}
          style={{
            width:"100%", height:"100%", objectFit:"cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition:"transform .6s ease",
          }}
        />
        <div style={{
          position:"absolute", top:12, left:12,
          background:"rgba(255,255,255,0.85)",
          backdropFilter:"blur(8px)",
          padding:"5px 10px", borderRadius:10,
          display:"flex", alignItems:"center", gap:6,
          boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
        }}>
          <img src="/static/workshop_app/img/fossee_logo.png" alt="FOSSEE" style={{height:18}} />
          <span style={{fontSize:10, fontWeight:700, color:BRAND, textTransform:"uppercase", letterSpacing:0.5}}>IIT Bombay</span>
        </div>

        <div style={{ position:"absolute", top:12, right:12 }}>
          <Badge
            label={w.level}
            bg={full ? "#6b7280" : levelColor}
          />
        </div>

        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          padding:"40px 18px 16px",
        }}>
          <h6 style={{
            margin:0, fontSize:19, fontWeight:700,
            color:"#fff", lineHeight:1.3,
            letterSpacing:"-0.01em",
          }}>
            {w.title}
          </h6>
        </div>
      </div>

      <div style={{padding:"20px",flex:1,display:"flex",flexDirection:"column",gap:16}}>
        
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:"#f3f4f6",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span className="material-icons" style={{fontSize:16, color:ACCENT}}>{icon}</span>
          </div>
          <span style={{fontSize:12, fontWeight:600, color:MUTED, textTransform:"uppercase", letterSpacing:"0.03em"}}>
            {w.category}
          </span>
        </div>

        <p style={{
          margin:0, fontSize:14, color:"#4b5563",
          lineHeight:1.6, flex:1, opacity:0.9,
        }}>
          {w.description}
        </p>

        <div style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"12px 14px",
          background:"#f8fafc",
          borderRadius:12,
          border:"1px solid #edf2f7",
        }}>
          <span className="material-icons" style={{fontSize:18,color:ACCENT}}>auto_awesome</span>
          <span style={{fontSize:13, fontWeight:600, color:BRAND}}>{w.duration}</span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:4 }}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#374151"}}>
            <div style={{width:24, height:24, borderRadius:"50%", background:ACCENT, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700}}>
              {w.instructor.split(" ").pop()[0]}
            </div>
            <span style={{fontWeight:500}}>{w.instructor}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:MUTED}}>
            <span className="material-icons" style={{fontSize:14}}>event_available</span>
            <span>{w.available.length} batches</span>
          </div>
        </div>

        <SeatBar booked={w.booked} seats={w.seats} />

        <button
          onClick={e => { e.stopPropagation(); !full && onBook(w); }}
          disabled={full}
          style={{
            padding:"12px 0",
            width:"100%",
            border:"none",
            borderRadius:12,
            background: full
              ? "#9ca3af"
              : hovered
                ? "#2563eb"
                : ACCENT,
            boxShadow: hovered && !full ? "0 8px 20px rgba(79, 110, 247, 0.3)" : "none",
            color:"#fff",
            fontWeight:700,
            fontSize:14,
            cursor: full ? "not-allowed" : "pointer",
            letterSpacing:"0.01em",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            transition:"all .3s ease",
            marginTop:4,
          }}
        >
          <span className="material-icons" style={{fontSize:18}}>
            {full ? "block" : "calendar_today"}
          </span>
          {full ? "Fully Booked" : "Reserve Your Spot"}
        </button>
      </div>
    </div>
  );
}

function BookingModal({ w, user, onClose, onConfirm }) {
  const [step,setStep]   = useState(1);
  const [date,setDate]   = useState("");
  const [conds,setConds] = useState({c1:false,c2:false,c3:false});
  if (!w) return null;
  const allOk = conds.c1 && conds.c2 && conds.c3 && date;
  const CONDITIONS = [
    {key:"c1",text:"We assure to give minimum 50 participants for the workshop."},
    {key:"c2",text:"We agree that this booking won't be cancelled without 2 days prior notice to the instructor and FOSSEE."},
    {key:"c3",text:"This proposal is subject to FOSSEE and instructor approval."},
  ];
  const Btn = ({label,bg,onClick,disabled=false}) => (
    <button onClick={onClick} disabled={disabled} style={{
      flex:1, padding:"10px 0", border:"none", borderRadius:7,
      background: disabled ? "#9ca3af" : bg,
      color:"#fff", fontWeight:700, fontSize:14,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{label}</button>
  );
  
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1050,padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:BRAND,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:11,marginBottom:3,letterSpacing:"0.05em",textTransform:"uppercase"}}>Book Workshop</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:17}}>{w.title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:20,cursor:"pointer",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb"}}>
          {["Your Info","Pick Date","Confirm"].map((label,i)=>{
            const active=step===i+1, done=step>i+1;
            return (
              <div key={label} style={{flex:1,padding:"11px 0",textAlign:"center",fontSize:12,fontWeight:600,color:active?ACCENT:done?SUCCESS:MUTED,borderBottom:active?`2px solid ${ACCENT}`:"2px solid transparent",background:active?"#f0f5ff":"#fff",transition:"all .2s"}}>
                {done?"✓ ":`${i+1}. `}{label}
              </div>
            );
          })}
        </div>
        <div style={{padding:"22px 24px"}}>
          {step===1&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Review your registration details before continuing.</p>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:16}}>
                {[["Full Name",user.name],["Email",user.email],["Institute",user.institute],["Department",user.department],["Role",user.position]].map(([k,v])=>(
                  <tr key={k} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"8px 0",color:MUTED,width:"38%"}}>{k}</td>
                    <td style={{padding:"8px 0",fontWeight:600,color:"#111827"}}>{v}</td>
                  </tr>
                ))}
              </table>
              <div style={{display:"flex",gap:8}}><Btn label="Next →" bg={ACCENT} onClick={()=>setStep(2)}/></div>
            </div>
          )}
          {step===2&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Select your preferred workshop date.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {w.available.map(d=>(
                  <label key={d} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${date===d?ACCENT:"#e5e7eb"}`,background:date===d?"#eef2ff":"#fafafa",transition:"all .15s"}}>
                    <input type="radio" name="date" value={d} checked={date===d} onChange={()=>setDate(d)} style={{accentColor:ACCENT}}/>
                    <span style={{fontSize:13,fontWeight:700,color:"#111827"}}>{fmtDate(d)}</span>
                  </label>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6b7280" onClick={()=>setStep(1)}/>
                <Btn label="Next →" bg={ACCENT} onClick={()=>setStep(3)} disabled={!date}/>
              </div>
            </div>
          )}
          {step===3&&(
            <div>
              <p style={{margin:"0 0 12px",fontSize:13,color:MUTED}}>Accept all conditions to confirm your booking.</p>
              {CONDITIONS.map(({key,text})=>(
                <label key={key} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12,cursor:"pointer"}}>
                  <input type="checkbox" checked={conds[key]} onChange={e=>setConds(c=>({...c,[key]:e.target.checked}))} style={{accentColor:ACCENT,marginTop:2,flexShrink:0}}/>
                  <span style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{text}</span>
                </label>
              ))}
              <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13}}>
                <div style={{color:MUTED,marginBottom:2,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Selected date</div>
                <div style={{fontWeight:700,color:"#111827"}}>{fmtDate(date)}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6b7280" onClick={()=>setStep(2)}/>
                <Btn label="✓ Confirm Booking" bg={SUCCESS} onClick={()=>allOk&&onConfirm(w,date)} disabled={!allOk}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessAlert({ booking, onDismiss }) {
  if (!booking) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16}}>
      <div style={{background:"#fff",borderRadius:12,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#22c55e,#16a34a)",padding:"16px 20px",color:"#fff",fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:8}}>
          <span className="material-icons">check_circle</span> Booking Submitted!
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{margin:"0 0 14px",fontSize:13,color:"#374151"}}>Your request is pending instructor / FOSSEE approval. You'll receive a confirmation email shortly.</p>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:18}}>
            {[["Workshop",booking.workshop.title],["Instructor",booking.workshop.instructor],["Date",fmtDate(booking.date)],["Status","Pending Approval"]].map(([k,v])=>(
              <tr key={k} style={{borderBottom:"1px solid #f3f4f6"}}>
                <td style={{padding:"7px 0",color:MUTED,width:"38%"}}>{k}</td>
                <td style={{padding:"7px 0",fontWeight:600,color:"#111827"}}>{v}</td>
              </tr>
            ))}
          </table>
          <button onClick={onDismiss} style={{width:"100%",padding:"10px",border:"none",borderRadius:8,background:SUCCESS,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

function MyBookingsPage({ bookings }) {
  if (bookings.length===0) return (
    <div style={{textAlign:"center",padding:"100px 20px"}}>
      <div style={{
        width:80, height:80, borderRadius:"50%", background: "#f3f4f6", 
        display:"flex", alignItems:"center", justifyContent:"center", 
        margin:"0 auto 20px"
      }}>
        <span className="material-icons" style={{fontSize:40,color:"#d1d5db"}}>event_busy</span>
      </div>
      <h5 style={{color:"#111827",fontWeight:700,margin:"0 0 10px",fontSize:20}}>Your journey starts here</h5>
      <p style={{color:MUTED,fontSize:15,margin:"0 0 24px"}}>You haven't saved any workshops yet. Let's find something inspiring!</p>
    </div>
  );
  return (
    <div>
      <h5 style={{margin:"0 0 24px",fontWeight:800,color:"#111827",fontSize:22,letterSpacing:"-0.02em"}}>Your Saved Workshops</h5>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {bookings.map((b,i)=>{
          const image = CAT_IMAGE[b.workshop.category] || CAT_IMAGE["Core"];
          return (
            <div key={i} style={{
              background:"#fff", border:"1px solid #f0f0f0", borderRadius:16, 
              padding:"12px", display:"flex", alignItems:"center", gap:20, 
              boxShadow:"0 10px 25px rgba(0,0,0,.03)",
              transition:"transform .2s ease",
            }}>
              <div style={{width:80,height:60,borderRadius:12,overflow:"hidden",flexShrink:0}}>
                <img src={image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:15,color:"#111827",marginBottom:4}}>{b.workshop.title}</div>
                <div style={{fontSize:13,color:MUTED,display:"flex",alignItems:"center",gap:4}}>
                  <span className="material-icons" style={{fontSize:14}}>person_outline</span> {b.workshop.instructor}
                  <span style={{margin:"0 4px"}}>·</span>
                  <span className="material-icons" style={{fontSize:14}}>event</span> {fmtDate(b.date)}
                </div>
              </div>
              <div style={{padding:"0 12px"}}>
                <span style={{
                  fontSize:11,fontWeight:700,color:WARN,background:"#fffbeb",
                  border: `1.5px solid ${WARN}20`,
                  borderRadius:20,padding:"4px 12px",whiteSpace:"nowrap",
                  textTransform:"uppercase", letterSpacing:0.5
                }}>Pending Approval</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkshopApp() {
  const [page,setPage]         = useState("workshops");
  const [filter,setFilter]     = useState("All");
  
  const [search,setSearch]     = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || "";
  });

  const [booking,setBooking]   = useState(null);
  const [success,setSuccess]   = useState(null);
  const [bookings,setBookings] = useState([]);
  const user = MOCK_USER;

  const filtered = WORKSHOPS.filter(w =>
    (filter==="All" || w.category===filter) &&
    (w.title.toLowerCase().includes(search.toLowerCase()) ||
     w.instructor.toLowerCase().includes(search.toLowerCase()) ||
     (w.description||"").toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = (w,date) => {
    setBookings(b=>[...b,{workshop:w,date}]);
    setBooking(null);
    setSuccess({workshop:w,date});
  };

  return (
    <div style={{fontFamily:"'Inter','Segoe UI',sans-serif",background:"transparent",minHeight:"80vh"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px 60px"}}>

        {page==="workshops" && (
          <div>
            <div style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{margin:"0 0 8px",fontWeight:800,color:"#111827",fontSize:"2rem",letterSpacing:"-0.02em"}}>
                  Shape Your Future
                </h2>
                <p style={{margin:0,fontSize:16,color:MUTED,maxWidth:500,lineHeight:1.5}}>
                  Join our community of {WORKSHOPS.length} specialized technical workshops designed to jumpstart your career with FOSSEE, IIT Bombay.
                </p>
              </div>
              <button
                onClick={()=>setPage("my-bookings")}
                style={{
                  background:"#fff", border:"1.5px solid #e5e7eb",
                  padding:"9px 18px", borderRadius:9,
                  fontSize:13, fontWeight:700, color:"#374151",
                  cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                  boxShadow:"0 1px 4px rgba(0,0,0,.06)",
                }}
              >
                <span className="material-icons" style={{fontSize:18}}>favorite_border</span>
                Saved Workshops {bookings.length>0 && `(${bookings.length})`}
              </button>
            </div>

            <div style={{
              background:"#fff", border:"1px solid #e5e7eb", borderRadius:10,
              padding:"12px 16px", marginBottom:28,
              display:"flex", gap:10, flexWrap:"wrap", alignItems:"center",
              boxShadow:"0 2px 12px rgba(0,0,0,.05)",
            }}>
              <div style={{position:"relative",flex:"1 1 280px"}}>
                <input
                  type="text"
                  placeholder="What would you like to learn today?"
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  style={{
                    width:"100%", padding:"12px 14px 12px 42px",
                    border:"1.5px solid #e5e7eb", borderRadius:12,
                    fontSize:14, outline:"none", background:"#f9fafb",
                    transition:"all .2s ease",
                  }}
                  onFocus={e=>e.target.style.borderColor=ACCENT}
                  onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                />
                <span className="material-icons" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:18,color:MUTED,pointerEvents:"none"}}>search</span>
              </div>
              <select
                value={filter}
                onChange={e=>setFilter(e.target.value)}
                style={{padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13.5,background:"#f9fafb",color:"#374151",cursor:"pointer",outline:"none"}}
              >
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
              <span style={{fontSize:13,color:MUTED,whiteSpace:"nowrap",marginLeft:"auto"}}>
                {filtered.length} of {WORKSHOPS.length} workshop{WORKSHOPS.length!==1?"s":""}
              </span>
            </div>

            {filtered.length === 0
              ? (
                <div style={{textAlign:"center",padding:"80px 0",color:MUTED}}>
                  <span className="material-icons" style={{fontSize:52,color:"#d1d5db",marginBottom:12}}>search_off</span>
                  <p style={{fontSize:16,margin:0}}>No workshops match your search.</p>
                  <button onClick={()=>{setSearch("");setFilter("All");}} style={{marginTop:12,background:"none",border:"none",color:ACCENT,fontSize:13,fontWeight:600,cursor:"pointer"}}>Clear filters</button>
                </div>
              )
              : (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:24}}>
                  {filtered.map(w=><WorkshopCard key={w.id} w={w} onBook={setBooking}/>)}
                </div>
              )
            }
          </div>
        )}

        {page==="my-bookings" && (
          <div>
            <button
              onClick={()=>setPage("workshops")}
              style={{background:"none",border:"none",padding:0,fontSize:14,color:ACCENT,fontWeight:700,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:4}}
            >
              <span className="material-icons" style={{fontSize:18}}>arrow_back</span> Back to Discovery
            </button>
            <MyBookingsPage bookings={bookings}/>
          </div>
        )}
      </div>

      {booking && <BookingModal w={booking} user={user} onClose={()=>setBooking(null)} onConfirm={handleConfirm}/>}
      {success  && <SuccessAlert booking={success} onDismiss={()=>setSuccess(null)}/>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('workshop-app-root'));
root.render(<WorkshopApp />);
