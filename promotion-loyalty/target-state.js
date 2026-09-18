/* Shared demo records: one marketing program -> price offers + voucher campaigns. */
window.BookeseTarget={
 key:'bookese-target-product-v1',
 read(){try{const x=JSON.parse(localStorage.getItem(this.key));if(x)return x}catch{}return {programs:[{id:'summer',name:'Kỳ nghỉ mùa thu 2026',start:'2026-09-01',end:'2026-12-31',owner:'Marketing Bookese',status:'Đang mở',description:'Thúc đẩy đặt phòng mùa thu tại các chỗ nghỉ tham gia.'}],prices:[{id:'autumn-price',program:'summer',name:'Ưu đãi lưu trú mùa thu',start:'2026-09-01',end:'2026-12-31',stayStart:'2026-09-01',stayEnd:'2026-12-31',min:15,max:25,inventory:10,placement:'Nhãn ưu đãi mùa thu và trang chiến dịch',limited:false,status:'Đang mở'}],registrations:[],member:{tier1:true,tier2:true,plans:{deluxe:2,suite:1},excluded:[]},maxDiscount:35,logs:[]}},
 write(d,message){d.logs.unshift({at:new Date().toLocaleString('vi-VN'),message});localStorage.setItem(this.key,JSON.stringify(d));window.dispatchEvent(new Event('bookese-change'))},
 update(fn,message){let d=this.read();fn(d);this.write(d,message)},
 esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
};
