/* Voucher types and issuance shared by the local prototype. No production writes. */
window.VoucherModel = (() => {
  const type = c => c.voucherType || (c.kind === 'gift' ? 'PARTNER' : c.distribution === 'personal' ? 'BOOKESE' : 'BOOKESE_PUBLIC');
  const today = () => new Date().toLocaleDateString('sv-SE', {timeZone:'Asia/Ho_Chi_Minh'});
  const records = c => (c.issued || []).filter(r=>!r.campaignId||r.campaignId===c.id);
  const active = c => c.status === 'Đang chạy' && (!c.start || c.start <= today()) && (!c.end || c.end >= today());
  const stock = c => type(c)==='PARTNER' ? (c.codes||[]).filter(code=>!records(c).some(r=>r.code===code)).length : Math.max(0,Number(c.quota||0)-records(c).length);
  function issue(d,c,user,source,reason,gift){
    if(!active(c))throw Error('Chiến dịch chưa phát hành, tạm ngừng hoặc ngoài thời gian cấp mã.');
    if(c.expiry && c.expiry<today())throw Error('Voucher đã hết hạn.');
    if(type(c)==='BOOKESE_PUBLIC')throw Error('Mã công khai không cấp qua đổi xu.');
    if(type(c)==='BOOKESE' && (c.issueMode||'exchange')!==source)throw Error('Không đúng hình thức cấp của chiến dịch.');
    if(!user || !stock(c))throw Error('Thiếu tài khoản nhận hoặc hết số lượng cấp.');
    if(source==='direct'&&!String(reason||'').trim())throw Error('Nhập lý do cấp bù.');
    d.voucherBalances ||= {}; d.voucherExchanges ||= [];
    if(gift){
      if(gift.status!=='Công khai')throw Error('Quà chưa công khai.');
      if(d.voucherExchanges.filter(r=>r.user===user&&r.giftId===gift.id).length>=Number(gift.limit||1))throw Error('Đã đạt giới hạn đổi quà.');
      const balance=d.voucherBalances[user]??100000;
      if(balance<Number(gift.price))throw Error('Không đủ xu.');
      d.voucherBalances[user]=balance-Number(gift.price);
    }
    const code=type(c)==='PARTNER'?(c.codes||[]).find(code=>!records(c).some(r=>r.code===code)):'BK'+crypto.randomUUID().replaceAll('-','').slice(0,16).toUpperCase();
    const r={id:crypto.randomUUID(),code,user,source,reason:reason||'',at:new Date().toISOString(),expiry:c.expiry,status:'Chưa sử dụng',delivery:'Đã gửi quà',campaignId:c.id,campaignName:c.name,voucherType:type(c),partner:c.partner||'',terms:c.terms||'',discount:c.discount,value:c.value,cap:c.cap,min:c.min||0,tier:c.tier||'all',audience:c.audience||'all',accountGroup:c.accountGroup||'all',giftId:gift?.id||'',giftName:gift?.name||'',coins:Number(gift?.price||0)};
    c.issued=[...records(c),r];
    if(gift)d.voucherExchanges.push(r);
    return r;
  }
  return {type,today,records,active,stock,issue};
})();
