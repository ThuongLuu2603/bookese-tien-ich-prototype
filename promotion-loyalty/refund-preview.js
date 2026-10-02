/* Shared cancellation preview for operational screens and both presentation versions. */
(function(){
const N=n=>Number(n).toLocaleString('vi-VN'),E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const field=(label,name,value)=>`<label class="field">${label}<input name="${name}" type="number" min="0" step="1" required value="${value}"></label>`;
const table=rows=>`<div style="overflow:auto"><table><tbody>${rows.map(([k,v])=>`<tr><td>${k}</td><td><b>${v}</b></td></tr>`).join('')}</tbody></table></div>`;
function policy(){return `<section class="card"><h2>Hoàn tiền, voucher và xu khi hủy dịch vụ</h2><p>Chính sách cập nhật 02/10/2026 · Áp dụng cho vé máy bay và khách sạn.</p>${table([
['Khách chủ động hủy, có phí hoặc miễn phí','Hoàn tiền thực trả trừ phí hủy/hoàn; vé máy bay có thể trừ thêm phí xử lý đã thông báo. Không hoàn voucher và xu đã dùng.'],
['Lỗi hệ thống / nhà cung cấp / Bookese','Hoàn đủ tiền thực trả, khôi phục toàn bộ voucher và xu đã dùng. Không thu phí hủy hoặc phí xử lý.'],
['Xu thưởng từ dịch vụ bị hủy','Hủy toàn bộ xu chờ, thu hồi toàn bộ xu đã cộng. Không tính theo tỷ lệ tiền hoàn, không thưởng trên phần phí giữ lại.'],
['Xu thưởng đã được tiêu','Hiển thị số dư âm; xu nhận sau bù vào số âm. Không trừ khoản thu hồi xu vào tiền hoàn cho khách.'],
['Phục hồi do lỗi dịch vụ','Xu còn hạn trả về lô gốc; xu đã hết hạn cấp lô bù 30 ngày. Khôi phục lượt voucher; mã không còn dùng được thì cấp quyền lợi tương đương. Không đổi voucher thành tiền.'],
['Đối soát','Giữ đơn hủy và lịch sử, nguyên nhân, phí, mã giao dịch gốc. Không xóa đơn; mỗi khoản chỉ xử lý một lần.']])}</section>`}
function form(o={}){const flight=o.flight!==false;return `<section class="card"><h2>${o.order?'Dự kiến xử lý '+E(o.order):'Thử tính tiền hoàn và xu'}</h2><form id="refundCalc" data-order="${E(o.order||'')}" data-flight="${flight}"><p>Tiền thực trả = Tổng tiền gồm thuế/phí − voucher − xu đã dùng.</p><div class="grid">
<label class="field">Nguyên nhân<select name="reason"><option value="customer">Khách chủ động hủy</option><option value="service">Lỗi hệ thống / NCC / Bookese</option></select></label>
${!o.order?'<label class="field">Dịch vụ<select name="kind"><option value="flight">Vé máy bay</option><option value="stay">Khách sạn</option></select></label>':''}
${o.order?`<input type="hidden" name="total" value="${o.total}"><input type="hidden" name="voucher" value="${o.voucher}"><input type="hidden" name="spent" value="${o.spent}"><div>${table([['Tổng tiền gồm thuế/phí',N(o.total)+'đ'],['Voucher / xu đã dùng',N(o.voucher)+'đ / '+N(o.spent)+' xu'],['Tiền thực trả',N(o.total-o.voucher-o.spent)+'đ']])}</div>`:field('Tổng tiền gồm thuế/phí (đ)','total',1050000)+field('Voucher đã dùng (đ)','voucher',50000)+field('Xu đã dùng (1 xu = 1đ)','spent',10000)}
<label class="field">Cách tính phí hủy/hoàn<select name="feeMode"><option value="amount">Số tiền cố định</option><option value="percent" ${!flight?'selected':''}>% trên tiền thực trả</option></select></label>
${field('Phí hủy/hoàn (đ)','fee',flight?500000:0)}${field('Phí hủy/hoàn (%)','feePercent',50)}${field('Phí xử lý hoàn vé bổ sung (đ)','processing',0)}
${o.order?`<input type="hidden" name="pending" value="${o.pending}"><input type="hidden" name="earned" value="${o.earned}">`:field('Xu thưởng còn chờ nhận','pending',10000)+field('Xu thưởng đã cộng','earned',0)}
</div>${!o.order?'<p class="muted">Phí xuất vé đã nằm trong tổng tiền ban đầu; phí xử lý hoàn vé là khoản bổ sung riêng, không trừ hai lần. Ví dụ vé: 400.000 + 600.000 thuế phí + 50.000 phí xuất vé = 1.050.000đ.</p>':''}<p id="refundReasonHint"></p><button class="primary">Xem kết quả</button><div id="refundResult" aria-live="polite"></div></form><p class="muted">Bản thử chỉ xem trước, không hoàn tiền hoặc ghi giao dịch thật. Giữ dữ liệu gốc để đối soát; không xử lý trùng khi nhận lại cùng yêu cầu.</p></section>`}
function bind(){const f=document.querySelector('#refundCalc');if(!f)return;
function update(){const fault=f.reason.value==='service',flight=f.kind?f.kind.value==='flight':f.dataset.flight==='true';for(const name of ['feeMode','fee','feePercent','processing']){const x=f.elements[name];const hide=fault||(name==='fee'&&f.feeMode.value!=='amount')||(name==='feePercent'&&f.feeMode.value!=='percent')||(name==='processing'&&!flight);x.closest('label').hidden=hide;x.disabled=hide;}f.querySelector('#refundReasonHint').textContent=fault?'Hoàn đủ tiền thực trả và voucher/xu đã dùng; không thu phí.':'Voucher và xu đã dùng không được hoàn, kể cả khi phí hủy bằng 0.';f.querySelector('#refundResult').textContent='';}
f.addEventListener('change',update);update();
f.onsubmit=ev=>{ev.preventDefault();try{const data=Object.fromEntries(new FormData(f));for(const k of ['total','voucher','spent','fee','processing','feePercent','pending','earned'])data[k]=Number(data[k]||0);const r=BookeseLoyalty.refund(data);f.querySelector('#refundResult').innerHTML=table([
['Tiền khách thực trả',N(r.paid)+'đ'],['Phí hủy/hoàn và xử lý',N(r.charge)+'đ'],['Tiền hoàn cho khách',N(r.cash)+'đ'],['Voucher khôi phục',r.fault?N(r.voucherBack)+'đ quyền lợi · không trả tiền mặt':'Không hoàn'],['Xu đã dùng được trả lại',N(r.back)+' xu'],['Xu chờ bị hủy',N(r.cancel)+' xu'],['Xu thưởng đã cộng bị thu hồi',N(r.revoke)+' xu']])+`<p>Xu thưởng của dịch vụ bị hủy còn được nhận: <b>0 xu</b>. Thu hồi xu độc lập với tiền hoàn.</p>`;}catch(err){f.querySelector('#refundResult').textContent=err.message;}};
}
window.RefundPreview={policy,form,bind};
})();
