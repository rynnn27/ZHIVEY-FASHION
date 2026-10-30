(async()=>{
 const cart=getCart(),summary=document.getElementById('checkout-summary');if(!cart.length){location.href='cart.html';return}
 summary.innerHTML='<h3>Ringkasan belanja</h3>'+cart.map(x=>`<div class="total-line"><span>${escapeHtml(x.name)} (${escapeHtml(x.size)} × ${x.qty})</span><b>${rupiah(x.price*x.qty)}</b></div>`).join('')+`<div class="total-line"><b>Total</b><b>${rupiah(cart.reduce((s,x)=>s+x.price*x.qty,0))}</b></div>`;
 document.getElementById('checkout-form').onsubmit=async e=>{e.preventDefault();const form=new FormData(e.currentTarget),customer={name:form.get('name').trim(),phone:form.get('phone').trim(),address:form.get('address').trim(),note:form.get('note').trim()};const btn=e.currentTarget.querySelector('button');btn.disabled=true;btn.textContent='Memproses...';
 try{
  const response=await fetch(ZH.workerBaseUrl+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer,items:cart})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Pesanan gagal disimpan');
  const order={...data.order,customer,items:cart};sessionStorage.setItem('zhivey_last_order',JSON.stringify(order));localStorage.removeItem('zhivey_cart');
  const lines=[`Halo ${ZH.storeName}, saya ingin konfirmasi pesanan ${order.orderNumber}.`,`Nama: ${customer.name}`,`No. HP: ${customer.phone}`,`Alamat: ${customer.address}`,``,...cart.map(x=>`- ${x.name} | ${x.color}/${x.size} | ${x.qty} x ${rupiah(x.price)} = ${rupiah(x.qty*x.price)}`),``,`Total: ${rupiah(order.total)}`,`Catatan: ${customer.note||'-'}`];
  const wa='https://wa.me/'+ZH.whatsapp+'?text='+encodeURIComponent(lines.join('\n'));location.href='order-success.html';setTimeout(()=>window.open(wa,'_blank','noopener'),700);
 }catch(err){alert(err.message);btn.disabled=false;btn.textContent='Buat pesanan & lanjut WhatsApp ↗'}
 };
})();
