import{useState,useRef}from"react";
const S={app:{minHeight:"100vh",background:"#080808",fontFamily:"Georgia,serif",color:"#f5f0e8"},header:{background:"#111",borderBottom:"1px solid #333",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,zIndex:100},logo:{fontSize:20,fontWeight:"bold",color:"#c9a84c",letterSpacing:2},tab:(a)=>({padding:"8px 16px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:1,background:a?"#c9a84c":"transparent",color:a?"#080808":"#888",fontFamily:"Georgia,serif"}),main:{maxWidth:1100,margin:"0 auto",padding:"32px 20px"},statRow:{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"},stat:{background:"#111",border:"1px solid #333",borderRadius:10,padding:"20px 24px",flex:1,minWidth:120},statNum:{fontSize:32,color:"#c9a84c",fontWeight:"bold"},statLabel:{fontSize:10,color:"#888",letterSpacing:2,marginTop:4},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:36},card:(a)=>({background:a?"#1a1612":"#111",border:`1px solid ${a?"#c9a84c":"#333"}`,borderRadius:12,padding:20,cursor:"pointer",transition:"all .3s"}),cardName:{fontSize:18,color:"#f5f0e8",marginBottom:4},cardDate:{fontSize:11,color:"#888",letterSpacing:1},badge:{background:"rgba(201,168,76,.15)",border:"1px solid #c9a84c",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#c9a84c",fontWeight:600,float:"right"},btnGold:{background:"linear-gradient(135deg,#7a6230,#c9a84c)",color:"#080808",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:700,letterSpacing:1,padding:"10px 20px",borderRadius:6,fontSize:12},btnOut:{background:"transparent",color:"#c9a84c",border:"1px solid #c9a84c",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,letterSpacing:1,padding:"10px 20px",borderRadius:6,fontSize:12},photoGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10},photoCard:{borderRadius:8,overflow:"hidden",position:"relative",cursor:"pointer"},photoImg:{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"},overlay:{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 55%)",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"10px 12px"},modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20},modalBox:{background:"#111",borderRadius:16,padding:36,maxWidth:440,width:"100%",border:"1px solid #c9a84c",textAlign:"center"},toast:{position:"fixed",bottom:28,right:28,background:"#c9a84c",color:"#080808",padding:"12px 22px",borderRadius:8,fontSize:13,fontWeight:700,zIndex:9999},input:{width:"100%",padding:"11px 14px",borderRadius:7,background:"#1a1a1a",border:"1px solid #333",color:"#f5f0e8",fontSize:14,fontFamily:"Georgia,serif",outline:"none",marginBottom:14,boxSizing:"border-box"},divider:{display:"flex",alignItems:"center",gap:12,margin:"28px 0 20px"},divLine:{flex:1,height:1,background:"#333"},divText:{fontSize:10,letterSpacing:3,color:"#c9a84c",textTransform:"uppercase"},guestHero:{textAlign:"center",padding:"60px 20px 40px",borderBottom:"1px solid #222",marginBottom:36},thumbRow:{display:"flex",gap:4,margin:"12px 0"},thumb:{flex:1,aspectRatio:"1",borderRadius:4,overflow:"hidden",position:"relative"},emptyBox:{border:"2px dashed #333",borderRadius:12,padding:60,textAlign:"center"}};
const QR=({id,size=160})=><img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent("https://yokex-creation.vercel.app/gallery/"+id)}&color=c9a84c&bgcolor=080808&qzone=2`} alt="QR" style={{width:size,height:size,display:"block",borderRadius:8}}/>;
export default function App(){
const[view,setView]=useState("admin");
const[events,setEvents]=useState([]);
const[activeId,setActiveId]=useState(null);
const[qrModal,setQrModal]=useState(null);
const[lightbox,setLightbox]=useState(null);
const[newModal,setNewModal]=useState(false);
const[nev,setNev]=useState({name:"",date:"",venue:""});
const[toast,setToast]=useState(null);
const[guestId,setGuestId]=useState(null);
const fileRef=useRef();
const showToast=m=>{setToast(m);setTimeout(()=>setToast(null),3000);};
const activeEv=events.find(e=>e.id===activeId);
const guestEv=events.find(e=>e.id===guestId);
const total=events.reduce((a,e)=>a+e.photos.length,0);
const upload=e=>{
const files=Array.from(e.target.files);
if(!files.length||!activeId)return;
const photos=files.map((f,i)=>({id:Date.now()+i,url:URL.createObjectURL(f),thumb:URL.createObjectURL(f),label:f.name.replace(/\.[^/.]+$/,"")}));
setEvents(ev=>ev.map(e=>e.id===activeId?{...e,photos:[...e.photos,...photos]}:e));
showToast("✦ "+files.length+" photo(s) uploaded!");
e.target.value="";
};
const createEv=()=>{
if(!nev.name||!nev.date)return;
const id="YKX"+Date.now();
const created={...nev,id,photos:[]};
setEvents(ev=>[...ev,created]);
setNev({name:"",date:"",venue:""});
setNewModal(false);
setActiveId(id);
setGuestId(id);
showToast("✦ Event created successfully!");
};
return(
<div style={S.app}>
<style>{`*{box-sizing:border-box;margin:0;padding:0}.hov:hover{opacity:.85;transform:translateY(-1px)}.card-hov:hover{transform:translateY(-3px);border-color:#c9a84c!important}.ph:hover .ov{opacity:1!important}`}</style>
<header style={S.header}>
<div style={S.logo}>✦ Yokex Creation</div>
<div style={{display:"flex",gap:4,background:"#1a1a1a",borderRadius:6,padding:3}}>
<button style={S.tab(view==="admin")} onClick={()=>setView("admin")}>Dashboard</button>
<button style={S.tab(view==="guest")} onClick={()=>setView("guest")}>Guest View</button>
</div>
</header>
{view==="admin"&&(
<div style={S.main}>
<div style={S.statRow}>
{[["✦",events.length,"Events"],["◉",total,"Photos Uploaded"],["◎",events.length,"QR Codes Active"]].map(([ic,n,l])=>(
<div key={l} style={S.stat}><div style={S.statNum}>{ic} {n}</div><div style={S.statLabel}>{l}</div></div>
))}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{fontSize:22,color:"#f5f0e8",letterSpacing:1}}>Your Events</div>
<button className="hov" style={S.btnGold} onClick={()=>setNewModal(true)}>+ New Event</button>
</div>
{events.length===0&&(
<div style={S.emptyBox}>
<div style={{fontSize:36,marginBottom:12}}>✦</div>
<div style={{fontSize:18,color:"#f5f0e8",marginBottom:8}}>No events yet</div>
<div style={{fontSize:13,color:"#888",marginBottom:24}}>Create your first event to get started</div>
<button className="hov" style={S.btnGold} onClick={()=>setNewModal(true)}>+ Create First Event</button>
</div>
)}
<div style={S.grid}>
{events.map(ev=>(
<div key={ev.id} className="card-hov" style={S.card(activeId===ev.id)} onClick={()=>setActiveId(activeId===ev.id?null:ev.id)}>
<span style={S.badge}>{ev.photos.length} photos</span>
<div style={S.cardName}>{ev.name}</div>
<div style={S.cardDate}>📅 {ev.date}</div>
{ev.venue&&<div style={{...S.cardDate,marginTop:2}}>📍 {ev.venue}</div>}
{ev.photos.length>0&&(
<div style={S.thumbRow}>
{ev.photos.slice(0,4).map((p,i)=>(
<div key={p.id} style={S.thumb}>
<img src={p.thumb} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
{i===3&&ev.photos.length>4&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#c9a84c",fontWeight:700}}>+{ev.photos.length-4}</div>}
</div>
))}
</div>
)}
<div style={{display:"flex",gap:8,marginTop:12}}>
<button className="hov" style={{...S.btnOut,flex:1,padding:"7px 0",fontSize:10}} onClick={e=>{e.stopPropagation();setQrModal(ev);}}>🔲 QR Code</button>
<button className="hov" style={{...S.btnGold,flex:1,padding:"7px 0",fontSize:10}} onClick={e=>{e.stopPropagation();setActiveId(ev.id);fileRef.current?.click();}}>⬆ Upload</button>
</div>
</div>
))}
</div>
{activeEv&&(
<>
<div style={S.divider}><div style={S.divLine}/><span style={S.divText}>{activeEv.name}</span><div style={S.divLine}/></div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{fontSize:13,color:"#888"}}>{activeEv.photos.length} photographs uploaded</div>
<button className="hov" style={S.btnGold} onClick={()=>fileRef.current?.click()}>+ Add Photos</button>
</div>
<input ref={fileRef} type="file" multiple accept="image/*" onChange={upload}/>
{activeEv.photos.length===0?(
<div style={S.emptyBox}><div style={{fontSize:28,marginBottom:8}}>✦</div><div style={{color:"#888",fontSize:15}}>No photos yet — tap Upload to add photos</div></div>
):(
<div style={S.photoGrid}>
{activeEv.photos.map(p=>(
<div key={p.id} className="ph" style={S.photoCard} onClick={()=>setLightbox({photo:p,ev:activeEv})}>
<img src={p.thumb} style={S.photoImg}/>
<div className="ov" style={{...S.overlay,opacity:0,transition:"opacity .25s"}}><span style={{color:"#fff",fontSize:11}}>{p.label}</span><span style={{color:"#c9a84c",fontSize:11}}>View ✦</span></div>
</div>
))}
</div>
)}
</>
)}
</div>
)}
{view==="guest"&&(
<div style={{...S.main,maxWidth:960}}>
<div style={S.guestHero}>
<div style={{fontSize:12,letterSpacing:5,color:"#c9a84c",marginBottom:16}}>YOKEX CREATION</div>
<div style={{fontSize:40,color:"#f5f0e8",marginBottom:12,fontStyle:"italic"}}>Your Memories</div>
<div style={{fontSize:14,color:"#888"}}>Scan the QR code at your event to access and download your photographs</div>
</div>
{events.length===0?(
<div style={S.emptyBox}><div style={{fontSize:28,marginBottom:8}}>✦</div><div style={{color:"#888",fontSize:15}}>No events available yet</div></div>
):(
<>
<div style={{textAlign:"center",marginBottom:32}}>
<div style={{fontSize:10,letterSpacing:4,color:"#c9a84c",marginBottom:12}}>SELECT YOUR EVENT</div>
<div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
{events.map(e=>(
<button key={e.id} className="hov" style={guestId===e.id?S.btnGold:S.btnOut} onClick={()=>setGuestId(e.id)}>{e.name}</button>
))}
</div>
</div>
{guestEv&&(
<>
<div style={{background:"#111",border:"1px solid #333",borderRadius:14,padding:24,marginBottom:32,display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
<div style={{flex:1}}>
<div style={{fontSize:26,color:"#f5f0e8",marginBottom:6}}>{guestEv.name}</div>
<div style={{fontSize:12,color:"#888",marginBottom:2}}>📅 {guestEv.date}</div>
{guestEv.venue&&<div style={{fontSize:12,color:"#888"}}>📍 {guestEv.venue}</div>}
<div style={{marginTop:12,fontSize:11,color:"#c9a84c"}}>● {guestEv.photos.length} Photos Available</div>
</div>
<div style={{textAlign:"center"}}>
<div style={{border:"1px solid #c9a84c",borderRadius:10,padding:10,background:"#0a0a0a",display:"inline-block"}}>
<QR id={guestEv.id} size={130}/>
</div>
<div style={{fontSize:9,color:"#666",letterSpacing:2,marginTop:6}}>SCAN TO ACCESS</div>
</div>
</div>
<div style={S.divider}><div style={S.divLine}/><span style={S.divText}>Gallery</span><div style={S.divLine}/></div>
{guestEv.photos.length===0?(
<div style={S.emptyBox}><div style={{color:"#888",fontSize:15}}>Photos will appear here once uploaded</div></div>
):(
<div style={S.photoGrid}>
{guestEv.photos.map(p=>(
<div key={p.id} className="ph" style={S.photoCard} onClick={()=>setLightbox({photo:p,ev:guestEv})}>
<img src={p.thumb} style={S.photoImg}/>
<div className="ov" style={{...S.overlay,opacity:0,transition:"opacity .25s",flexDirection:"column",gap:8,justifyContent:"flex-end",alignItems:"stretch"}}>
<span style={{color:"#fff",fontSize:11}}>{p.label}</span>
<button className="hov" style={{...S.btnGold,padding:"6px 0",width:"100%",fontSize:11}} onClick={e=>{e.stopPropagation();const a=document.createElement("a");a.href=p.url;a.download="yokex-"+p.id+".jpg";a.target="_blank";a.click();showToast("✦ Download started");}}>⬇ Download</button>
</div>
</div>
))}
</div>
)}
<div style={{textAlign:"center",marginTop:36}}>
<button className="hov" style={{...S.btnGold,padding:"13px 40px",fontSize:13}} onClick={()=>showToast("✦ Preparing all photos for download...")}>⬇ Download All Photos</button>
<div style={{fontSize:11,color:"#666",marginTop:10}}>Photographed by Yokex Creation · All rights reserved</div>
</div>
</>
)}
</>
)}
</div>
)}
{qrModal&&(
<div style={S.modal} onClick={()=>setQrModal(null)}>
<div style={S.modalBox} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:10,letterSpacing:4,color:"#c9a84c",marginBottom:8}}>EVENT QR CODE</div>
<div style={{fontSize:22,color:"#f5f0e8",marginBottom:24}}>{qrModal.name}</div>
<div style={{display:"inline-block",border:"1px solid #c9a84c",borderRadius:10,padding:12,background:"#0a0a0a",marginBottom:16}}><QR id={qrModal.id} size={170}/></div>
<div style={{fontSize:11,color:"#666",marginBottom:8}}>yokex-creation.vercel.app</div>
<div style={{fontSize:12,color:"#888",marginBottom:24,lineHeight:1.6}}>Print this QR code and place it at the venue. Guests scan to instantly access and download all photographs.</div>
<div style={{display:"flex",gap:10}}>
<button className="hov" style={{...S.btnGold,flex:1,padding:"11px 0"}} onClick={()=>{window.print();showToast("✦ Sending to printer");}}>🖨️ Print QR</button>
<button className="hov" style={{...S.btnOut,flex:1,padding:"11px 0"}} onClick={()=>setQrModal(null)}>Close</button>
</div>
</div>
</div>
)}
{lightbox&&(
<div style={S.modal} onClick={()=>setLightbox(null)}>
<div style={{maxWidth:780,width:"100%"}} onClick={e=>e.stopPropagation()}>
<img src={lightbox.photo.url} style={{width:"100%",borderRadius:12,maxHeight:"68vh",objectFit:"contain",display:"block"}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,flexWrap:"wrap",gap:10}}>
<div><div style={{fontSize:20,color:"#f5f0e8"}}>{lightbox.photo.label}</div><div style={{fontSize:12,color:"#888",marginTop:4}}>{lightbox.ev.name}</div></div>
<div style={{display:"flex",gap:10}}>
<button className="hov" style={{...S.btnGold,padding:"9px 24px"}} onClick={()=>{const a=document.createElement("a");a.href=lightbox.photo.url;a.download="yokex-"+lightbox.photo.id+".jpg";a.target="_blank";a.click();showToast("✦ Download started");}}>⬇ Download</button>
<button className="hov" style={{...S.btnOut,padding:"9px 18px"}} onClick={()=>setLightbox(null)}>✕</button>
</div>
</div>
</div>
</div>
)}
{newModal&&(
<div style={S.modal} onClick={()=>setNewModal(false)}>
<div style={S.modalBox} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:26,color:"#f5f0e8",marginBottom:6}}>New Event</div>
<div style={{fontSize:12,color:"#888",marginBottom:24}}>Create a new event to start uploading photographs</div>
{[["name","Event Name","e.g. Ravi & Priya Wedding","text"],["date","Event Date","","date"],["venue","Venue (optional)","e.g. The Grand Palace, Chennai","text"]].map(([k,l,ph,t])=>(
<div key={k} style={{textAlign:"left",marginBottom:4}}>
<div style={{fontSize:10,letterSpacing:3,color:"#c9a84c",marginBottom:6}}>{l}</div>
<input type={t} placeholder={ph} value={nev[k]} onChange={e=>setNev(n=>({...n,[k]:e.target.value}))} style={S.input}/>
</div>
))}
<div style={{display:"flex",gap:10,marginTop:8}}>
<button className="hov" style={{...S.btnGold,flex:1,padding:"12px 0"}} onClick={createEv}>Create Event</button>
<button className="hov" style={{...S.btnOut,flex:1,padding:"12px 0"}} onClick={()=>setNewModal(false)}>Cancel</button>
</div>
</div>
</div>
)}
{toast&&<div style={S.toast}>{toast}</div>}
<div style={{textAlign:"center",padding:"28px 0",borderTop:"1px solid #222",marginTop:40,fontSize:10,color:"#444",letterSpacing:3}}>✦ Yokex Creation · Photography Studio · All Rights Reserved</div>
</div>
);
  }
  
