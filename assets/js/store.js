(async()=>{
 const path=location.pathname;
 try{
  const products=(await getProducts()).filter(p=>p.status!=='inactive');
  if(document.getElementById('featured-products'))renderCards(products.slice(0,4),'featured-products');
  if(document.getElementById('product-list')){
   const cat=document.getElementById('category');[...new Set(products.map(p=>p.category))].sort().forEach(c=>cat.add(new Option(c,c)));
   const draw=()=>{let list=[...products],q=document.getElementById('search').value.toLowerCase(),c=cat.value,s=document.getElementById('sort').value;list=list.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q)&&(!c||p.category===c));if(s==='low')list.sort((a,b)=>a.price-b.price);if(s==='high')list.sort((a,b)=>b.price-a.price);if(s==='name')list.sort((a,b)=>a.name.localeCompare(b.name));if(s==='newest')list.sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));renderCards(list,'product-list')};
   ['search','category','sort'].forEach(id=>document.getElementById(id).addEventListener(id==='search'?'input':'change',draw));draw();
  }
  if(document.getElementById('product-detail')){
   const id=new URLSearchParams(location.search).get('id'),p=products.find(x=>x.id===id),el=document.getElementById('product-detail');
   if(!p){el.innerHTML='<div class="empty">Produk tidak ditemukan. <a href="shop.html">Kembali ke katalog</a></div>';return}
   const colors=p.variants||[];let color=colors[0]?.color||'',size=colors[0]?.sizes?.find(s=>s.stock>0)?.name||'';
   el.innerHTML=`<div class="detail-layout"><img class="detail-image" src="${assetUrl(p.images?.[0])}" alt="${escapeHtml(p.name)}"><div class="detail-info"><p class="eyebrow">${escapeHtml(p.category)}</p><h1>${escapeHtml(p.name)}</h1><p class="price">${rupiah(p.price)}</p><p>${escapeHtml(p.description)}</p><span class="field-label">PILIH WARNA</span><div id="colors" class="variant-row">${colors.map((v,i)=>`<button class="variant-btn ${i===0?'selected':''}" data-color="${escapeHtml(v.color)}">${escapeHtml(v.color)}</button>`).join('')}</div><span class="field-label">PILIH UKURAN</span><div id="sizes" class="variant-row"></div><span class="field-label">JUMLAH</span><input id="qty" class="quantity" type="number" min="1" value="1"><p id="stock-label" class="small muted"></p><button id="add" class="btn btn-dark full">Tambah ke keranjang</button></div></div>`;
   const drawSizes=()=>{const v=colors.find(x=>x.color===color);document.getElementById('sizes').innerHTML=(v?.sizes||[]).map(s=>`<button class="variant-btn ${s.name===size?'selected':''}" data-size="${escapeHtml(s.name)}" ${s.stock<1?'disabled':''}>${escapeHtml(s.name)}</button>`).join('');document.getElementById('stock-label').textContent='Stok tersedia: '+(v?.sizes.find(s=>s.name===size)?.stock||0)};
   document.getElementById('colors').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(!b)return;color=b.dataset.color;size=colors.find(x=>x.color===color)?.sizes.find(s=>s.stock>0)?.name||'';document.querySelectorAll('[data-color]').forEach(x=>x.classList.toggle('selected',x===b));drawSizes()});
   document.getElementById('sizes').addEventListener('click',e=>{const b=e.target.closest('[data-size]');if(!b)return;size=b.dataset.size;drawSizes()});drawSizes();
   document.getElementById('add').onclick=()=>{const v=colors.find(x=>x.color===color),s=v?.sizes.find(x=>x.name===size),qty=Number(document.getElementById('qty').value);if(!s||qty<1||qty>s.stock)return alert('Pilih variasi dan jumlah sesuai stok.');addToCart(p,color,size,qty);alert('Produk ditambahkan ke keranjang.')};
  }
 }catch(e){document.querySelectorAll('#featured-products,#product-list,#product-detail').forEach(x=>x.textContent=e.message)}
})();
function renderCards(list,target){const el=document.getElementById(target);if(!list.length){el.innerHTML='<div class="empty">Produk belum tersedia.</div>';return}el.innerHTML=list.map(p=>`<article class="product-card"><a class="product-photo" href="product.html?id=${encodeURIComponent(p.id)}"><img loading="lazy" src="${assetUrl(p.images?.[0])}" alt="${escapeHtml(p.name)}"></a><div class="product-meta"><h3><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h3><p>${escapeHtml(p.category)}</p><p class="price">${rupiah(p.price)}</p></div></article>`).join('')}
