"use client";
import {motion} from "framer-motion";
import {ArrowDown,ArrowUpRight,Heart,Menu,Search,ShoppingBag,Sparkles,UserRound,X} from "lucide-react";
import {useState} from "react";

const products=[
 {name:"Aleri No. 01 — Obsidian Tee",price:"₹3,490",tag:"SIGNATURE",desc:"Heavyweight 280 GSM cotton, architectural silhouette."},
 {name:"Aleri No. 02 — Ivory Form",price:"₹3,990",tag:"NEW",desc:"Soft ivory jersey with a deliberately relaxed cut."},
 {name:"Aleri No. 03 — Noir Atelier",price:"₹4,290",tag:"ATELIER",desc:"Minimal black form with an elevated hand-feel."}
];

function Garment3D(){return <div className="stage"><div className="halo"/><motion.div className="garment" animate={{rotateY:[-10,10,-10],rotateX:[2,-2,2]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}><div className="shoulder left"/><div className="shoulder right"/><div className="body"/><div className="neck"/><div className="sleeve left"/><div className="sleeve right"/><div className="label">ALERI</div></motion.div><div className="stage-caption"><span>01 / 03</span><span>SCULPTED FORM</span></div></div>}

export default function Home(){
 const [menu,setMenu]=useState(false); const [cart,setCart]=useState(0);
 return <main>
  <header className="nav"><button className="icon mobile" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><a className="logo" href="#">MAISON <i>ALERI</i></a><nav><a href="#collection">Collection</a><a href="#house">The House</a><a href="#journal">Journal</a></nav><div className="nav-actions"><button><Search/></button><button><UserRound/></button><button className="bag" onClick={()=>setCart(cart+1)}><ShoppingBag/><b>{cart}</b></button></div></header>
  {menu&&<div className="mobile-menu"><a href="#collection" onClick={()=>setMenu(false)}>Collection</a><a href="#house" onClick={()=>setMenu(false)}>The House</a><a href="#journal" onClick={()=>setMenu(false)}>Journal</a></div>}
  <section className="hero"><div className="hero-copy"><p className="eyebrow">MAISON ALERI / EST. 2026</p><h1>Quietly<br/><em>extraordinary.</em></h1><p className="lead">A new house of modern luxury. Considered forms, uncompromising materials, and pieces made to outlive the moment.</p><div className="hero-actions"><a className="primary" href="#collection">Discover the collection <ArrowUpRight/></a><a className="text-link" href="#house">Enter the house <ArrowDown/></a></div></div><Garment3D/><div className="hero-bottom"><span>MADE FOR THE FEW</span><span>INDIA / WORLDWIDE</span><span>SCROLL TO EXPLORE ↓</span></div></section>
  <section className="manifesto" id="house"><p className="eyebrow">THE MAISON</p><h2>Luxury is not excess.<br/><em>It is intention.</em></h2><p>Maison Aleri creates contemporary wardrobe pieces through restraint. Every proportion, texture and detail exists for a reason. No noise. No compromise.</p></section>
  <section className="collection" id="collection"><div className="section-head"><div><p className="eyebrow">01 — THE COLLECTION</p><h2>Objects of <em>desire.</em></h2></div><a href="#">View all pieces <ArrowUpRight/></a></div><div className="product-grid">{products.map((p,i)=><motion.article key={p.name} className="product" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}><div className={"product-visual p"+i}><span>{p.tag}</span><button><Heart/></button><div className="mini-garment"/></div><div className="product-meta"><div><h3>{p.name}</h3><p>{p.desc}</p></div><strong>{p.price}</strong></div><button className="add" onClick={()=>setCart(cart+1)}>Add to bag <ArrowUpRight/></button></motion.article>)}</div></section>
  <section className="editorial" id="journal"><div className="editorial-image"><div className="editorial-mark">A</div></div><div className="editorial-copy"><p className="eyebrow">02 — THE JOURNAL</p><h2>The art of<br/><em>less.</em></h2><p>Inside the visual language of Maison Aleri: monochrome architecture, tactile cotton and the pursuit of a silhouette that feels inevitable.</p><a className="primary dark" href="#">Read the story <ArrowUpRight/></a></div></section>
  <section className="future"><Sparkles/><p className="eyebrow">THE NEXT CHAPTER</p><h2>Designed in the digital.<br/><em>Made for the real world.</em></h2><p>Immersive commerce, considered objects and a house that evolves with you.</p></section>
  <footer><div><a className="logo" href="#">MAISON <i>ALERI</i></a><p>A house of modern luxury.</p></div><div className="footer-links"><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Contact</a><a href="#">Instagram</a></div><small>© 2026 Maison Aleri. All rights reserved.</small></footer>
  <div className="cart-pill"><ShoppingBag/> {cart} {cart===1?"piece":"pieces"} <span>•</span> ₹{cart?3490*cart:0}</div>
 </main>
}
