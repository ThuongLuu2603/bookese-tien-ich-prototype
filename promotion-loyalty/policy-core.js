(function(root){
const day=s=>Date.parse(s+'T00:00:00Z'),date=(s,n)=>new Date(day(s)+n*86400000).toISOString().slice(0,10);
function check(p,s,d){
 if(p.status!=='active')return 'Chương trình chưa hoạt động';
 if(p.type==='Flash Sale'){const a=Date.parse(p.boostStart+'+07:00'),b=Date.parse(p.boostEnd+'+07:00'),booking=Date.parse(s.book+'T12:00:00+07:00');if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a||booking<a||booking>=b)return 'Ngoài cửa sổ Flash Sale (giả lập đặt lúc 12:00)';}
 if(p.type==='Thứ hạng'){
 const a=Date.parse(p.boostStart+'+07:00'),b=Date.parse(p.boostEnd+'+07:00'),booking=Date.parse(s.book+'T12:00:00+07:00');
 if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a||b-a>72*3600000)return 'Cần cấu hình đợt tối đa 72 giờ';
 if(booking<a||booking>=b)return 'Ngoài đợt Thứ hạng (giả lập đặt lúc 12:00)';
 if(!Number.isInteger(Number(p.inventory))||Number(p.inventory)<1)return 'Chưa cấu hình hạn lượng phòng';
 }
 if(s.book<p.start||s.book>p.end)return 'Ngoài thời gian nhận đặt';
 if(p.wholeStay&&(s.stay<p.stayStart||date(s.stay,s.nights-1)>p.stayEnd))return 'Cần toàn bộ kỳ lưu trú trong lịch';
 if(p.wholeStay&&Array.from({length:s.nights},(_,i)=>date(s.stay,i)).some(x=>p.excluded?.includes(x)||(p.weekdays&&!p.weekdays.includes(new Date(day(x)).getUTCDay()))))return 'Cần toàn bộ kỳ lưu trú hợp lệ';
 if(p.excluded?.includes(d))return 'Ngày loại trừ';
 if(d<p.stayStart||d>p.stayEnd)return 'Đêm ngoài lịch ưu đãi';
 if(p.weekdays&&!p.weekdays.includes(new Date(day(d)).getUTCDay()))return 'Ngày trong tuần không áp dụng';
 
 if(p.room!=='all'&&p.room!==s.room)return 'Không áp dụng phòng / loại giá này';
 const lead=Math.round((day(s.stay)-day(s.book))/86400000);
 if(p.type==='Phút chót'&&lead>p.threshold)return 'Đặt quá sớm';
 if(p.type==='Đặt sớm'&&lead<p.threshold)return 'Chưa đủ ngày đặt trước';
 if(p.type==='Dài hạn'&&s.nights<p.threshold)return 'Chưa đủ số đêm';
 if(p.type==='Thị trường khách')return 'Theo quốc gia chưa mở';
 if(p.type==='Di động'&&(!['web-mobile','app'].includes(s.channel)||(p.channel&&p.channel!=='both'&&p.channel!==s.channel)))return 'Không đúng kênh di động';
 return '';
}
function quote(data,s,prices){
 if(!Number.isInteger(s.nights)||s.nights<1||s.nights>365||!Number.isFinite(day(s.stay))||!Number.isFinite(day(s.book))||s.stay<s.book)return {error:'Kiểm tra ngày đặt, ngày nhận phòng và số đêm (1–365).'};
 if(!Number.isFinite(data.maxDiscount)||data.maxDiscount<0||data.maxDiscount>=100)return {error:'Nhập trần giảm từ 0 đến dưới 100%. Đây là cấu hình chỗ nghỉ, không có mức mặc định bắt buộc.'};
 if(prices.length!==s.nights||prices.some(p=>!Number.isSafeInteger(p)||p<=0))return {error:'Nhập giá gộp nguyên dương cho từng đêm.'};
 let rows=[];
 for(let i=0;i<s.nights;i++){
  let d=date(s.stay,i),base=prices[i],floor=Math.ceil(base*(10000-Math.round(data.maxDiscount*100))/10000),eligible=data.items.filter(p=>!check(p,s,d)),combos=[];
  const add=(branch,ps)=>{let price=base;for(const p of ps)price=Math.floor(price*(10000-Math.round(p.rate*100))/10000);combos.push({branch,ps,price,ok:price>=floor})};
  const m=s.tier<0||!data.member||data.memberExcluded?.includes(d)?0:s.tier===2&&data.member===2?15:10,mem=m?[{name:'Giá thành viên',rate:m}]:[];
  eligible.filter(p=>p.group==='exclusive').forEach(p=>add('A',[p]));eligible.filter(p=>p.group==='campaign').forEach(p=>add('B',[p,...mem]));
  for(const c of [null,...eligible.filter(p=>p.group==='condition')])for(const t of [null,...eligible.filter(p=>p.group==='market')])add('C',[c,t,...mem].filter(Boolean));add('Gốc',[]);
  combos.sort((a,b)=>a.price-b.price||a.ps.length-b.ps.length||a.branch.localeCompare(b.branch)||a.ps.map(p=>p.id||0).join(',').localeCompare(b.ps.map(p=>p.id||0).join(',')));
  rows.push({date:d,base,floor,combos,best:combos.find(c=>c.ok),excluded:data.items.map(p=>({name:p.name,reason:check(p,s,d)})).filter(p=>p.reason)});
 }
 return {rows,total:rows.reduce((a,r)=>a+(r.best?.price||0),0),base:prices.reduce((a,b)=>a+b,0),error:rows.some(r=>!r.best)?'Không có giá hợp lệ cho ít nhất một đêm.':null};
}
function promo(total,p){if(!p)return {discount:0};if(!p.active)return {discount:0,reason:'Mã tạm ngưng'};if(total<p.min)return {discount:0,reason:'Chưa đạt giá tối thiểu '+p.min.toLocaleString('vi-VN')+' đ'};const n=Math.min(total,p.kind==='percent'?Math.floor(total*p.value/100):p.value,p.kind==='percent'?p.cap:total);if(p.budget<n||p.quota<1)return {discount:0,reason:'Không đủ ngân sách hoặc lượt'};return {discount:n};}
function returnCoins({spent,earned,ratio,expired,cause,sameMonth}){const back=Math.floor(spent*ratio/100),revoke=Math.floor(earned*ratio/100),service=cause==='service';return {back,available:!expired||service?back:0,expired:expired&&!service?back:0,compensation:expired&&service?back:0,revoke,monthQuota:sameMonth?back:0,expiry:expired&&service?'Lô bù 30 ngày':'Giữ hạn lô gốc'};}
function promoReturn(cause,valid){return {failed:['Giải phóng lượt đang giữ','Giải phóng ngân sách đang giữ'],service:[valid?'Khôi phục quyền dùng mã':'Xem xét cấp mã thay thế','Hoàn ngân sách sau khi xác nhận hoàn tác tài trợ'],free:[valid?'Trả lượt cá nhân, giữ hạn mã':'Không tự gia hạn mã hết hạn','Hoàn ngân sách theo chi phí thực tế đã hoàn tác'],fee:['Không tự trả lượt mã','Đối soát phần tài trợ thực tế'],partial:['Không trả nguyên lượt','Điều chỉnh phần tài trợ theo phân bổ'],amend:['Giữ liên kết lần dùng, kiểm lại điều kiện','Chỉ điều chỉnh chênh lệch, không tạo lượt thứ hai']}[cause];}
const api={date,check,quote,promo,returnCoins,promoReturn};root.BookesePolicy=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
