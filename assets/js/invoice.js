function downloadInvoice(order){
 if(!window.jspdf?.jsPDF){alert('Library PDF belum termuat. Periksa koneksi internet.');return}
 const {jsPDF}=window.jspdf,doc=new jsPDF(),left=18;let y=20;
 doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text('ZHIVEY FASHION',left,y);y+=8;doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('NOTA PEMBELIAN',left,y);y+=12;
 doc.text('Nomor: '+order.orderNumber,left,y);y+=6;doc.text('Tanggal: '+new Date(order.createdAt||Date.now()).toLocaleString('id-ID'),left,y);y+=8;
 doc.text('Pembeli: '+(order.customer?.name||'-'),left,y);y+=6;doc.text('WhatsApp: '+(order.customer?.phone||'-'),left,y);y+=6;
 const address=doc.splitTextToSize('Alamat: '+(order.customer?.address||'-'),170);doc.text(address,left,y);y+=address.length*5+7;
 doc.setFont('helvetica','bold');doc.text('Produk',left,y);doc.text('Qty',130,y);doc.text('Harga',150,y);doc.text('Jumlah',190,y,{align:'right'});y+=4;doc.line(left,y,192,y);y+=7;doc.setFont('helvetica','normal');
 (order.items||[]).forEach(x=>{if(y>270){doc.addPage();y=20}const label=doc.splitTextToSize(`${x.name} (${x.color}/${x.size})`,100);doc.text(label,left,y);doc.text(String(x.qty),130,y);doc.text(rupiah(x.price),150,y);doc.text(rupiah(x.price*x.qty),190,y,{align:'right'});y+=Math.max(7,label.length*5)});
 y+=4;doc.line(left,y,192,y);y+=9;doc.setFont('helvetica','bold');doc.text('TOTAL',left,y);doc.text(rupiah(order.total),190,y,{align:'right'});y+=12;doc.setFont('helvetica','normal');doc.text('Terima kasih telah berbelanja di ZHIVEY FASHION.',left,y);doc.save(`Nota-${order.orderNumber}.pdf`);
}
