import{useState,useRef,useEffect}from"react";
import{initializeApp}from"firebase/app";
import{getFirestore,collection,addDoc,getDocs,doc,updateDoc,arrayUnion,query,orderBy}from"firebase/firestore";

const firebaseConfig={
  apiKey:"AIzaSyDxCOEdH9RDBPvKevmBg4NNdOayk",
  authDomain:"yokexcreation-5423b.firebaseapp.com",
  projectId:"yokexcreation-5423b",
  storageBucket:"yokexcreation-5423b.firebasestorage.app",
  messagingSenderId:"1034963838634",
  appId:"1:1034963838634:web:c528700e97cd69094e92d3"
};

const firebaseApp=initializeApp(firebaseConfig);
const db=getFirestore(firebaseApp);
const CLOUD_NAME="dstczp9yh";
const UPLOAD_PRESET="yokex_uploads";

// *** CHANGE THIS TO YOUR OWN PIN ***
const DASHBOARD_PIN="1234";

const S={app:{minHeight:"100vh",background:"#080808",fontFamily:"Georgia,serif",color:"#f5f0e8"},header:{background:"#111",borderBottom:"1px solid #333",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,zIndex:100},logo:{fontSize:20,fontWeight:"bold",color:"#c9a84c",letterSpacing:2},tab:(a)=>({padding:"8px 16px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:1,background:a?"#c9a84c":"transparent",color:a?"#080808":"#888",fontFamily:"Georgia,serif"}),main:{maxWidth:1100,margin:"0 auto",padding:"32px 20px"},statRow:{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"},stat:{background:"#111",border:"1px solid #333",borderRadius:10,padding:"20px 24px",flex:1,minWidth:120},statNum:{fontSize:32,color:"#c9a84c",fontWeight:"bold"},statLabel:{fontSize:10,color:"#888",letterSpacing:2,marginTop:4},grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:36},card:(a)=>({background:a?"#1a1612":"#111",border:`1px solid ${a?"#c9a84c":"#333"}`,borderRadius:12,padding:20,cursor:"pointer",transition:"all .3s"}),cardName:{fontSize:18,color:"#f5f0e8",marginBottom:4},cardDate:{fontSize:11,color:"#888",letterSpacing:1},badge:{background:"rgba(201,168,76,.15)",border:"1px solid #c9a84c",borderRadius:20,padding:"3px 10px",fontSize:11,color:"#c9a84c",fontWeight:600,float:"right"},btnGold:{background:"linear-gradient(135deg,#7a6230,#c9a84c)",color:"#080808",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:700,letterSpacing:1,padding:"10px 20px",borderRadius:6,fontSize:12},btnOut:{background:"transparent",color:"#c9a84c",border:"1px solid #c9a84c",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,letterSpacing:1,padding:"10px 20px",borderRadius:6,fontSize:12},btnDel:{background:"rgba(255,80,80,.15)",color:"#ff5050",border:"1px solid rgba(255,80,80,.4)",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,padding:"5px 10px",borderRadius:5,fontSize:10},photoGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10},photoCard:{borderRadius:8,overflow:"hidden",position:"relative",cursor:"pointer"},photoImg:{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"},overlay:{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 55%)",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"10px 12px"},modal:{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20},modalBox:{background:"#111",borderRadius:16,padding:36,maxWidth:440,width:"100%",border:"1px solid #c9a84c",textAlign:"center"},toast:{position:"fixed",bottom:28,right:28,background:"#c9a84c",color:"#080808",padding:"12px 22px",borderRadius:8,fontSize:13,fontWeight:700,zIndex:9999,maxWidth:300},input:{width:"100%",padding:"11px 14px",borderRadius:7,background:"#1a1a1a",border:"1px solid #333",color:"#f5f0e8",fontSize:14,fontFamily:"Georgia,serif",outline:"none",marginBottom:14,boxSizing:"border-box"},divider:{display:"flex",alignItems:"center",gap:12,margin:"28px 0 20px"},divLine:{flex:1,height:1,background:"#333"},divText:{fontSize:10,letterSpacing:3,color:"#c9a84c",textTransform:"uppercase"},guestHero:{textAlign:"center",padding:"60px 20px 40px",borderBottom:"1px solid #222",marginBottom:36},thumbRow:{display:"flex",gap:4,margin:"12px 0"},thumb:{flex:1,aspectRatio:"1",borderRadius:4,overflow:"hidden",position:"relative"},emptyBox:{border:"2px dashed #333",borderRadius:12,padding:60,textAlign:"center"},progress:{width:"100%",height:6,background:"#222",borderRadius:3,overflow:"hidden",marginTop:12},progressBar:(p)=>({height:"100%",background:"linear-gradient(90deg,#7a6230,#c9a84c)",width:p+"%",transition:"width .3s",borderRadius:3})};

const QR=({id,size=160})=><img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent("https://yokex-creation.vercel.app/?event="+id)}&color=c9a84c&bgcolor=080808&qzone=2`} alt="QR" style={{width:size,height:size,display:"block",borderRadius:8}}/>;

export default function App(){
const[view,setView]=useState("admin");
const[pinLocked,setPinLocked]=useState(true);
const[pinInput,setPinInput]=useState("");
const[pinError,setPinError]=useState(false);
const[events,setEvents]=useState([]);
const[activeId,setActiveId]=useState(null);
const[qrModal,setQrModal]=useState(null);
const[lightbox,setLightbox]=useState(null);
const[newModal,setNewModal]=useState(false);
const[nev,setNev]=useState({name:"",date:"",venue:""});
const[toast,setToast]=useState(null);
const[guestId,setGuestId]=useState(null);
const[uploading,setUploading]=useState(false);
const[uploadProgress,setUploadProgress]=useState(0);
const[uploadStatus,setUploadStatus]=useState("");
const[loading,setLoading]=useState(true);
const[deleteConfirm,setDeleteConfirm]=useState(null);
const fileRef=useRef();

const showToast=m=>{setToast(m);setTimeout(()=>setToast(null),4000);};

useEffect(()=>{
const params=new URLSearchParams(window.location.search);
const eventParam=params.get("event");
if(eventParam){setView("guest");setGuestId(eventParam);}
loadEvents();
},[]);

const loadEvents=async()=>{
try{
setLoading(true);
const q=query(collection(db,"events"),orderBy("createdAt","desc"));
const snap=await getDocs(q);
const evs=snap.docs.map(d=>({id:d.id,...d.data()}));
setEvents(evs);
if(evs.length>0&&!guestId)setGuestId(evs[0].id);
}catch(e){showToast("⚠️ Error loading events");}
finally{setLoading(false);}
};

const checkPin=()=>{
if(pinInput===DASHBOARD_PIN){setPinLocked(false);setPinError(false);setPinInput("");}
else{setPinError(true);setPinInput("");}
};

const activeEv=events.find(e=>e.id===activeId);
const guestEv=events.find(e=>e.id===guestId);
const total=events.reduce((a,e)=>a+(e.photos?.length||0),0);

const uploadToCloudinary=async(file)=>{
const fd=new FormData();
fd.append("file",file);
fd.append("upload_preset",UPLOAD_PRESET);
fd.append("folder","yokex-creation");
const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:"POST",body:fd});
const data=await res.json();
return{url:data.secure_url,thumb:data.secure_url.replace("/upload/","/upload/w_400,c_fill/"),label:file.name.substring(0,file.name.lastIndexOf("."))||file.name};
};

const upload=async(e)=>{
const files=Array.from(e.target.files);
if(!files.length||!activeId)return;
setUploading(true);
setUploadProgress(0);
let done=0;
const uploaded=[];
for(const file of files){
try{
setUploadStatus(`Uploading ${done+1} of ${files.length}...`);
const photo=await uploadToCloudinary(file);
uploaded.push(photo);
done++;
setUploadProgress(Math.round((done/files.length)*100));
}catch(err){showToast("⚠️ Failed: "+file.name);}
}
if(uploaded.length>0){
try{
await updateDoc(doc(db,"events",activeId),{photos:arrayUnion(...uploaded)});
setEvents(ev=>ev.map(ev=>ev.id===activeId?{...ev,photos:[...(ev.photos||[]),...uploaded]}:ev));
showToast("✦ "+uploaded.length+" photo(s) uploaded & saved!");
}catch(err){showToast("⚠️ Error saving to database");}
}
setUploading(false);setUploadProgress(0);setUploadStatus("");e.target.value="";
};

const deletePhoto=async(evId,photoIndex)=>{
const ev=events.find(e=>e.id===evId);
if(!ev)return;
const newPhotos=ev.photos.filter((_,i)=>i!==photoIndex);
try{
await updateDoc(doc(db,"events",evId),{photos:newPhotos});
setEvents(evs=>evs.map(e=>e.id===evId?{...e,photos:newPhotos}:e));
setDeleteConfirm(null);
setLightbox(null);
showToast("🗑️ Photo deleted successfully!");
}catch(err){showToast("⚠️ Error deleting photo");}
};

const createEv=async()=>{
if(!nev.name||!nev.date)return;
try{
const ref=await addDoc(collection(db,"events"),{...nev,photos:[],createdAt:new Date().toISOString()});
const created={...nev,id:ref.id,photos:[]};
setEvents(ev=>[created,...ev]);
setNev({name:"",date:"",venue:""});
setNewModal(false);setActiveId(ref.id);setGuestId(ref.id);
showToast("✦ Event created & saved!");
}catch(err){showToast("⚠️ Error creating event");}
};

return(
<div style={S.app}>
<style>{`*{box-sizing:border-box;margin:0;padding:0}.hov:hover{opacity:.85;transform:translateY(-1px)}.card-hov:hover{transform:translateY(-3px);border-color:#c9a84c!important}.ph:hover .ov{opacity:1!important}.del-btn:hover{background:rgba(255,80,80,.3)!important}`}</style>
<header style={S.header}>
<div style={S.logo}>✦ Yokex Creation</div>
<div style={{display:"flex",gap:4,background:"#1a1a1a",borderRadius:6,padding:3}}>
<button style={S.tab(view==="admin")} onClick={()=>setView("admin")}>Dashboard</button>
<button style={S.tab(view==="guest")} onClick={()=>setView("guest")}>Guest View</button>
</div>
</header>

{/* ── PIN LOCK SCREEN ── */}
{view==="admin"&&pinLocked&&(
<div style={S.modal}>
<div style={S.modalBox}>
<div style={{fontSize:40,marginBottom:12}}>🔐</div>
<div style={{fontSize:24,color:"#c9a84c",marginBottom:6,fontWeight:"bold"}}>Yokex Creation</div>
<div style={{fontSize:13,color:"#888",marginBottom:28}}>Enter your Dashboard PIN to continue</div>
<input
type="password"
maxLength={6}
placeholder="● ● ● ●"
value={pinInput}
onChange={e=>setPinInput(e.target.value)}
onKeyDown={e=>e.key==="Enter"&&checkPin()}
style={{...S.input,textAlign:"center",fontSize:28,letterSpacing:12,marginBottom:8}}
autoFocus
/>
{pinError&&<div style={{color:"#ff5050",fontSize:13,marginBottom:12}}>❌ Wrong PIN. Try again.</div>}
{!pinError&&<div style={{height:28}}/>}
<button className="hov" style={{...S.btnGold,width:"100%",padding:"14px 0",fontSize:13}} onClick={checkPin}>Unlock Dashboard</button>
</div>
</div>
)}

{/* ── ADMIN DASHBOARD ── */}
{view==="admin"&&!pinLocked&&(
<div style={S.main}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
<div style={{fontSize:11,color:"#c9a84c",letterSpacing:2}}>✦ DASHBOARD UNLOCKED</div>
<button className="hov" style={{...S.btnOut,padding:"6px 16px",fontSize:10}} onClick={()=>setPinLocked(true)}>🔒 Lock</button>
</div>
<div style={S.statRow}>
{[["✦",events.length,"Events"],["◉",total,"Photos Saved"],["◎",events.length,"QR Codes"],["☁",uploading?"...":"✓","Cloud Sync"]].map(([ic,n,l])=>(
<div key={l} style={S.stat}><div style={S.statNum}>{ic} {n}</div><div style={S.statLabel}>{l}</div></div>
))}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{fontSize:22,color:"#f5f0e8"}}>Your Events</div>
<button className="hov" style={S.btnGold} onClick={()=>setNewModal(true)}>+ New Event</button>
</div>
{loading&&<div style={{...S.emptyBox,padding:40}}><div style={{color:"#c9a84c",fontSize:16}}>⟳ Loading events...</div></div>}
{!loading&&events.length===0&&(
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
<span style={S.badge}>{ev.photos?.length||0} photos</span>
<div style={S.cardName}>{ev.name}</div>
<div style={S.cardDate}>📅 {ev.date}</div>
{ev.venue&&<div style={{...S.cardDate,marginTop:2}}>📍 {ev.venue}</div>}
{ev.photos?.length>0&&(
<div style={S.thumbRow}>
{ev.photos.slice(0,4).map((p,i)=>(
<div key={i} style={S.thumb}>
<img src={p.thumb||p.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
{i===3&&ev.photos.length>4&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#c9a84c",fontWeight:700}}>+{ev.photos.length-4}</div>}
</div>
))}
</div>
)}
<div style={{display:"flex",gap:8,marginTop:12}}>
<button className="hov" style={{...S.btnOut,flex:1,padding:"7px 0",fontSize:10}} onClick={e=>{e.stopPropagation();setQrModal(ev);}}>🔲 QR Code</button>
<button className="hov" style={{...S.btnGold,flex:1,padding:"7px 0",fontSize:10}} onClick={e=>{e.stopPropagation();setActiveId(ev.id);fileRef.current?.click();}} disabled={uploading}>{uploading&&activeId===ev.id?"Uploading...":"⬆ Upload"}</button>
</div>
</div>
))}
</div>

{activeEv&&(
<>
<div style={S.divider}><div style={S.divLine}/><span style={S.divText}>{activeEv.name}</span><div style={S.divLine}/></div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{fontSize:13,color:"#888"}}>{activeEv.photos?.length||0} photographs • stored in cloud ☁️</div>
<button className="hov" style={S.btnGold} onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?"Uploading...":"+ Add Photos"}</button>
</div>
<input ref={fileRef} type="file" multiple accept="image/*" onChange={upload}/>
{uploading&&(
<div style={{background:"#111",border:"1px solid #333",borderRadius:10,padding:20,marginBottom:20,textAlign:"center"}}>
<div style={{fontSize:13,color:"#c9a84c",marginBottom:8}}>{uploadStatus}</div>
<div style={S.progress}><div style={S.progressBar(uploadProgress)}/></div>
<div style={{fontSize:11,color:"#888",marginTop:6}}>{uploadProgress}% complete</div>
</div>
)}
{!activeEv.photos?.length?(
<div style={S.emptyBox}><div style={{fontSize:28,marginBottom:8}}>✦</div><div style={{color:"#888",fontSize:15}}>No photos yet — tap Upload to add photos</div></div>
):(
<div style={S.photoGrid}>
{activeEv.photos.map((p,i)=>(
<div key={i} className="ph" style={S.photoCard}>
<img src={p.thumb||p.url} style={S.photoImg} onClick={()=>setLightbox({photo:p,ev:activeEv,index:i})}/>
<div className="ov" style={{...S.overlay,opacity:0,transition:"opacity .25s",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",padding:8}}>
<button className="del-btn" style={S.btnDel} onClick={e=>{e.stopPropagation();setDeleteConfirm({evId:activeEv.id,index:i,label:p.label});}}>🗑️ Delete</button>
<span style={{color:"#fff",fontSize:11,padding:"0 4px"}}>{p.label}</span>
</div>
</div>
))}
</div>
)}
</>
)}
</div>
)}

{/* ── GUEST VIEW ── */}
{view==="guest"&&(
<div style={{...S.main,maxWidth:960}}>
<div style={S.guestHero}>
<div style={{fontSize:12,letterSpacing:5,color:"#c9a84c",marginBottom:16}}>YOKEX CREATION</div>
<div style={{fontSize:40,color:"#f5f0e8",marginBottom:12,fontStyle:"italic"}}>Your Memories</div>
<div style={{fontSize:14,color:"#888"}}>Scan the QR code at your event to access and download your photographs</div>
</div>
{loading&&<div style={{...S.emptyBox,padding:40}}><div style={{color:"#c9a84c"}}>⟳ Loading...</div></div>}
{!loading&&events.length===0&&<div style={S.emptyBox}><div style={{color:"#888"}}>No events available yet</div></div>}
{!loading&&events.length>0&&(
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
<div style={{marginTop:12,fontSize:11,color:"#c9a84c"}}>● {guestEv.photos?.length||0} Photos Available</div>
</div>
<div style={{textAlign:"center"}}>
<div style={{border:"1px solid #c9a84c",borderRadius:10,padding:10,background:"#0a0a0a",display:"inline-block"}}>
<QR id={guestEv.id} size={130}/>
</div>
<div style={{fontSize:9,color:"#666",letterSpacing:2,marginTop:6}}>SCAN TO SHARE</div>
</div>
</div>
<div style={S.divider}><div style={S.divLine}/><span style={S.divText}>Gallery</span><div style={S.divLine}/></div>
{!guestEv.photos?.length?(
<div style={S.emptyBox}><div style={{color:"#888"}}>Photos will appear here once uploaded ☁️</div></div>
):(
<div style={S.photoGrid}>
{guestEv.photos.map((p,i)=>(
<div key={i} className="ph" style={S.photoCard} onClick={()=>setLightbox({photo:p,ev:guestEv,index:i})}>
<img src={p.thumb||p.url} style={S.photoImg}/>
<div className="ov" style={{...S.overlay,opacity:0,transition:"opacity .25s",flexDirection:"column",gap:8,justifyContent:"flex-end",alignItems:"stretch"}}>
<span style={{color:"#fff",fontSize:11}}>{p.label}</span>
<button className="hov" style={{...S.btnGold,padding:"6px 0",width:"100%",fontSize:11}} onClick={e=>{e.stopPropagation();window.open(p.url,"_blank");showToast("✦ Opening photo for download");}}>⬇ Download</button>
</div>
</div>
))}
</div>
)}
<div style={{textAlign:"center",marginTop:36}}>
<div style={{fontSize:11,color:"#666",marginTop:10}}>Photographed by Yokex Creation · All rights reserved</div>
</div>
</>
)}
</>
)}
</div>
)}

{/* ── QR MODAL ── */}
{qrModal&&(
<div style={S.modal} onClick={()=>setQrModal(null)}>
<div style={S.modalBox} onClick={e=>e.stopPropagation()}>
<div style={{fontSize:10,letterSpacing:4,color:"#c9a84c",marginBottom:8}}>EVENT QR CODE</div>
<div style={{fontSize:22,color:"#f5f0e8",marginBottom:24}}>{qrModal.name}</div>
<div style={{display:"inline-block",border:"1px solid #c9a84c",borderRadius:10,padding:12,background:"#0a0a0a",marginBottom:16}}><QR id={qrModal.id} size={170}/></div>
<div style={{fontSize:11,color:"#666",marginBottom:8}}>yokex-creation.vercel.app/?event={qrModal.id}</div>
<div style={{fontSize:12,color:"#888",marginBottom:24,lineHeight:1.6}}>Print & place at venue. Guests scan to instantly view & download all photos permanently!</div>
<div style={{display:"flex",gap:10}}>
<button className="hov" style={{...S.btnGold,flex:1,padding:"11px 0"}} onClick={()=>{window.print();showToast("✦ Sending to printer");}}>🖨️ Print QR</button>
<button className="hov" style={{...S.btnOut,flex:1,padding:"11px 0"}} onClick={()=>setQrModal(null)}>Close</button>
</div>
</div>
</div>
)}

{/* ── LIGHTBOX ── */}
{lightbox&&(
<div style={S.modal} onClick={()=>setLightbox(null)}>
<div style={{maxWidth:780,width:"100%"}} onClick={e=>e.stopPropagation()}>
<img src={lightbox.photo.url} style={{width:"100%",borderRadius:12,maxHeight:"68vh",objectFit:"contain",display:"block"}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16,flexWrap:"wrap",gap:10}}>
<div><div style={{fontSize:20,color:"#f5f0e8"}}>{lightbox.photo.label}</div><div style={{fontSize:12,color:"#888",marginTop:4}}>{lightbox.ev.name}</div></div>
<div style={{display:"flex",gap:10}}>
<button className="hov" style={{...S.btnGold,padding:"9px 24px"}} onClick={()=>{window.open(lightbox.photo.url,"_blank");showToast("✦ Opening for download");}}>⬇ Download</button>
{view==="admin"&&<button className="hov" style={{...S.btnDel,padding:"9px 16px",fontSize:12}} onCli
