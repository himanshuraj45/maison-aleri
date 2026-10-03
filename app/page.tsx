"use client";

import { useMemo, useState } from "react";
import { Heart, Search, ShoppingBag, UserRound, Menu, X, ChevronDown, SlidersHorizontal, Plus, Minus } from "lucide-react";

type Product={id:number;name:string;price:number;old?:number;tag?:string;cat:string;image:string;colors:string[]};

const products:Product[]=[
 {id:1,name:"Aleri Sculpted Mini Dress",price:1990,old:2490,tag:"10% OFF",cat:"Dresses",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",colors:["#111","#d9b8a8"]},
 {id:2,name:"Aleri Relaxed Co-ord Set",price:2290,old:2890,tag:"NEW IN",cat:"Co-ords",image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",colors:["#eee","#8c8c84"]},
 {id:3,name:"Aleri Ribbed Everyday Top",price:990,old:1290,tag:"BEST SELLING",cat:"Tops",image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",colors:["#111","#f2eee7","#8b6b62"]},
 {id:4,name:"Aleri Wide Leg Trousers",price:1690,old:1990,tag:"NEW IN",cat:"Bottoms",image:"https://images.unsplash.com/photo-1506629905607-d9d1f9f5e6f7?auto=format&fit=crop&w=900&q=85",colors:["#151515","#b8aa98"]},
 {id:5,name:"Aleri Satin Slip Dress",price:1890,old:2290,tag:"",cat:"Dresses",image:"https://images.unsplash.com/photo-1566174053-4b9b1e4b7e8a?auto=format&fit=crop&w=900&q=85",colors:["#171717","#a98b85"]},
 {id:6,name:"Aleri Cropped Jacket",price:2490,old:2990,tag:"LIMITED",cat:"Outerwear",image:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=85",colors:["#111","#d6c9b8"]},
 {id:7,name:"Aleri Soft Knit Cardigan",price:1790,old:2190,tag:"BEST SELLING",cat:"Knitwear",image:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=85",colors:["#eee","#927a6a"]},
 {id:8,name:"Aleri Tailored Shirt",price:1490,old:1890,tag:"NEW IN",cat:"Tops",image:"https://images.unsplash.com/photo-1603252110481-7baafd363b9f?auto=format&fit=crop&w=900&q=85",colors:["#fff","#111"]},
 {id:9,name:"Aleri Denim A-Line Skirt",price:1590,old:1990,tag:"",cat:"Bottoms",image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",colors:["#3e5062","#111"]},
 {id:10,name:"Aleri Evening Corset Top",price:1290,old:1690,tag:"10% OFF",cat:"Tops",image:"https://images.unsplash.com/photo-1564257577054-0b7a4e3b6f7b?auto=format&fit=crop&w=900&q=85",colors:["#111","#c9aaa4"]}
];

const cats=["ALL","NEW IN","DRESSES","TOPS","BOTTOMS","CO-ORDS","OUTERWEAR","BEST SELLERS"];

export default function Home(){
 const [cat,setCat]=useState("ALL"),[search,setSearch]=useState(""),[cart,setCart]=useState<Record<number,number>>({}),[wish,setWish]=useState<number[]>([]),[drawer,setDrawer]=useState(false),[menu,setMenu]=useState(false),[quick,setQuick]=useState<Product|null>(null),[sort,setSort]=useState("Recommended"),[filterOpen,setFilterOpen]=useState(false),[checkout,setCheckout]=useState(false),[orderDone,setOrderDone]=useState(false),[payment,setPayment]=useState("razorpay"),[paying,setPaying]=useState(false),[customer,setCustomer]=useState({name:"",email:"",phone:"",address:"",city:"",state:"Tamil Nadu",pincode:""});
 const list=useMemo(()=>{let a=products.filter(p=>(cat==="ALL"||p.cat.toUpperCase()===cat||cat==="BEST SELLERS"&&p.tag==="BEST SELLING"||cat==="NEW IN"&&p.tag==="NEW IN")&&p.name.toLowerCase().includes(search.toLowerCase()));if(sort==="Price: Low to High")a.sort((x,y)=>x.price-y.price);if(sort==="Price: High to Low")a.sort((x,y)=>y.price-x.price);return a},[cat,search,sort]);
 const count=Object.values(cart).reduce((a,b)=>a+b,0),total=Object.entries(cart).reduce((s,[id,q])=>s+(products.find(p=>p.id===+id)?.price||0)*q,0);
 const add=(id:number)=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
 const checkoutItems=Object.entries(cart).map(([id,quantity])=>({id:Number(id),quantity}));
 const updateCustomer=(key:keyof typeof customer,value:string)=>setCustomer(c=>({...c,[key]:value}));
 const startPayment=async()=>{if(!customer.name||!customer.email||!customer.phone||!customer.address||!customer.city||!customer.pincode){alert("Please complete your delivery details.");return}setPaying(true);try{if(payment==="cod"){setOrderDone(true);setDrawer(false);setCheckout(false);return}const res=await fetch("/api/payment/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:checkoutItems,customer})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Unable to create payment");const script=document.createElement("script");script.src="https://checkout.razorpay.com/v1/checkout.js";script.onload=()=>{const rzp=new (window as any).Razorpay({key:data.key,amount:data.amount,currency:data.currency,name:"Maison Aleri",description:"Maison Aleri order",order_id:data.orderId,prefill:{name:customer.name,email:customer.email,contact:customer.phone},theme:{color:"#111111"},handler:async(response:any)=>{const verify=await fetch("/api/payment/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(response)});const result=await verify.json();if(!verify.ok)throw new Error(result.error||"Payment verification failed");setOrderDone(true);setDrawer(false);setCheckout(false);setCart({});},modal:{ondismiss:()=>setPaying(false)}});rzp.open();setPaying(false)};script.onerror=()=>{throw new Error("Payment gateway could not load.")};document.body.appendChild(script)}catch(e){alert(e instanceof Error?e.message:"Payment failed");setPaying(false)}};
 const change=(id:number,n:number)=>setCart(c=>{const q=(c[id]||0)+n;if(q<=0){const x={...c};delete x[id];return x}return {...c,[id]:q}});
 return <div className="savana-page">
  <div className="sale-bar">FREE SHIPPING ON ORDERS OVER ₹1,999 <span>•</span> EASY RETURNS <span>•</span> MADE FOR YOUR EVERYDAY</div>
  <header className="shop-header">
   <button className="mobile-menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
   <a className="brand" href="#">MAISON <b>ALERI</b></a>
   <nav className={menu?"open":""}>{cats.slice(0,6).map(c=><button key={c} onClick={()=>{setCat(c);setMenu(false)}}>{c}</button>)}</nav>
   <div className="head-icons"><button onClick={()=>document.getElementById("search")?.focus()}><Search/></button><button><UserRound/></button><button onClick={()=>setDrawer(true)} className="bag-icon"><ShoppingBag/><i>{count}</i></button></div>
  </header>
  <div className="search-line"><Search/><input id="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dresses, tops, co-ords..." /></div>
  <section className="hero-shop">
   <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=88"/>
   <div><small>THE NEW ALERI EDIT</small><h1>Dress like<br/><em>yourself.</em></h1><button onClick={()=>setCat("NEW IN")}>SHOP NEW IN →</button></div>
  </section>
  <div className="category-strip">{cats.map(c=><button className={cat===c?"active":""} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div>
  <main className="catalog">
   <div className="catalog-head"><div><span>MAISON ALERI</span><h2>{cat==="ALL"?"FOR YOU":cat.replace("CO-ORDS","CO-ORD SETS")}</h2><p>{list.length} pieces</p></div><div className="catalog-actions"><button onClick={()=>setFilterOpen(!filterOpen)}><SlidersHorizontal/> FILTER</button><select value={sort} onChange={e=>setSort(e.target.value)}><option>Recommended</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div></div>
   {filterOpen&&<div className="filters"><button>Size <ChevronDown/></button><button>Color <ChevronDown/></button><button>Occasion <ChevronDown/></button><button>Style <ChevronDown/></button><button>Price <ChevronDown/></button></div>}
   <div className="product-grid">{list.map(p=><article className="shop-product" key={p.id}>
    <div className="pic" onClick={()=>setQuick(p)}><img src={p.image}/>{p.tag&&<label>{p.tag}</label>}<button className="heart" onClick={e=>{e.stopPropagation();setWish(w=>w.includes(p.id)?w.filter(x=>x!==p.id):[...w,p.id])}}><Heart fill={wish.includes(p.id)?"currentColor":"none"}/></button><button className="quick" onClick={e=>{e.stopPropagation();add(p.id);setDrawer(true)}}>QUICK ADD</button></div>
    <div className="pinfo"><div><h3>{p.name}</h3><p>MAISON ALERI</p><div className="swatches">{p.colors.map(c=><i key={c} style={{background:c}}/>)}</div></div><strong>₹{p.price.toLocaleString("en-IN")} {p.old&&<del>₹{p.old.toLocaleString("en-IN")}</del>}</strong></div>
   </article>)}</div>
  </main>
  <section className="story"><div><small>THE ALERI APPROACH</small><h2>Clothes for<br/><em>real life.</em></h2><p>Easy silhouettes, elevated details and pieces designed to move with you. A modern wardrobe without the noise.</p><button>OUR STORY →</button></div></section>
  <section className="newsletter"><small>STAY IN THE LOOP</small><h2>New drops.<br/>No noise.</h2><p>Sign up for new arrivals, private edits and occasional offers.</p><div><input placeholder="Your email address"/><button>JOIN →</button></div></section>
  <footer><div><a className="brand">MAISON <b>ALERI</b></a><p>Modern clothing for every version of you.</p></div><div><b>SHOP</b><a>New In</a><a>Dresses</a><a>Tops</a><a>Co-ords</a></div><div><b>HELP</b><a>Size Guide</a><a>Shipping</a><a>Returns</a><a>Contact</a></div><div><b>FOLLOW</b><a>Instagram</a><a>Pinterest</a><a>TikTok</a></div><small>© 2026 Maison Aleri</small></footer>
  {drawer&&<div className="drawer-bg" onClick={()=>setDrawer(false)}><aside className="bag-drawer" onClick={e=>e.stopPropagation()}><div className="bag-top"><h2>Your Bag</h2><button onClick={()=>setDrawer(false)}><X/></button></div>{!count?<div className="empty-bag">Your bag is empty.<button onClick={()=>setDrawer(false)}>CONTINUE SHOPPING</button></div>:<><div className="bag-items">{Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id===+id)!;return <div className="bag-item" key={id}><img src={p.image}/><div><h3>{p.name}</h3><p>₹{p.price.toLocaleString("en-IN")}</p><div><button onClick={()=>change(+id,-1)}><Minus/></button>{q}<button onClick={()=>change(+id,1)}><Plus/></button></div></div></div>})}</div><div className="bag-total"><span>SUBTOTAL</span><b>₹{total.toLocaleString("en-IN")}</b><button onClick={()=>{setDrawer(false);setCheckout(true)}}>CHECKOUT →</button></div></>}</aside></div>}
  {quick&&<div className="quick-bg" onClick={()=>setQuick(null)}><div className="quick-modal" onClick={e=>e.stopPropagation()}><button className="qclose" onClick={()=>setQuick(null)}><X/></button><img src={quick.image}/><div><small>{quick.tag||"MAISON ALERI"}</small><h2>{quick.name}</h2><b>₹{quick.price.toLocaleString("en-IN")}</b><p>Designed for an effortless everyday wardrobe. Select your size and add to bag.</p><div className="sizes">{["XS","S","M","L","XL"].map(s=><button key={s}>{s}</button>)}</div><button className="addbag" onClick={()=>{add(quick.id);setQuick(null);setDrawer(true)}}>ADD TO BAG →</button></div></div></div>}
 </div>
}