const ZH = window.ZHIVEY_CONFIG;
const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
const assetUrl = p => p && (/^https?:\/\//i.test(p) ? p : new URL(p, document.baseURI).href);
function getCart(){try{return JSON.parse(localStorage.getItem('zhivey_cart')||'[]')}catch{return []}}
function saveCart(c){localStorage.setItem('zhivey_cart',JSON.stringify(c));updateCartCount()}
function updateCartCount(){const el=document.getElementById('cart-count');if(el)el.textContent=getCart().reduce((s,x)=>s+Number(x.qty),0)}
async function getProducts(){const r=await fetch(ZH.productsUrl+'?v='+Date.now());if(!r.ok)throw new Error('Katalog tidak dapat dimuat');return r.json()}
function addToCart(product,color,size,qty=1){const cart=getCart();const key=[product.id,color,size].join('|');const old=cart.find(x=>x.key===key);if(old)old.qty+=qty;else cart.push({key,id:product.id,name:product.name,price:product.price,image:product.images?.[0]||'',color,size,qty});saveCart(cart)}
function setYear(){const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear()}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
updateCartCount();setYear();
