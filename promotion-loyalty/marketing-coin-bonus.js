/* Offer and coin settings live on the existing marketing-period detail page. */
(function(){
  const T=BookeseTarget;
  const scopeLabel={all:'Tất cả chuyến bay',domestic:'Nội địa',international:'Quốc tế'};
  const number=value=>Number(value||0).toLocaleString('vi-VN');
  const activePeriod=()=>targetProgram()?.status==='Đang mở';

  window.coinBonusForm=()=>{
    const p=targetProgram(),bonus=p.coinBonus||{};
    modal('Thưởng thêm xu · '+p.name,`<form id="coinBonusForm">
      <label><input type="checkbox" name="enabled" ${bonus.enabled?'checked':''}> Bật thưởng thêm xu cho đợt này</label>
      <p class="muted">Dùng lịch nhận đặt và trạng thái của đợt tiếp thị: ${e(p.start)} → ${e(p.end)}.</p>
      <div class="fields" id="coinBonusFields">
        ${select('Dịch vụ','service',[['Lưu trú','Lưu trú'],['Vé máy bay','Vé máy bay'],['Cả hai','Cả hai']],bonus.service||'Lưu trú')}
        ${field('Hệ số xu','multiplier','number',bonus.multiplier||2,'min="2" max="10" step="1"')}
        ${select('Hạn dùng phần xu thưởng thêm','months',[['3','3 tháng'],['4','4 tháng'],['5','5 tháng'],['6','6 tháng']],String(bonus.months||3))}
      </div>
      <div id="coinBonusError" class="error"></div>
      <div class="actions"><button type="button" onclick="closeModal()">Hủy</button><button class="primary">Lưu cấu hình</button></div>
    </form>`);
    const form=document.querySelector('#coinBonusForm');
    const toggle=()=>form.querySelectorAll('#coinBonusFields input,#coinBonusFields select').forEach(input=>input.disabled=!form.elements.enabled.checked);
    form.elements.enabled.onchange=toggle;
    toggle();
    form.onsubmit=event=>{
      event.preventDefault();
      const enabled=form.elements.enabled.checked;
      const multiplier=Number(form.elements.multiplier.value);
      if(enabled&&(!Number.isInteger(multiplier)||multiplier<2||multiplier>10)){
        form.querySelector('#coinBonusError').textContent='Hệ số xu phải từ 2 đến 10.';
        return;
      }
      const next={enabled,service:form.elements.service.value||bonus.service||'Lưu trú',multiplier:enabled?multiplier:Number(bonus.multiplier||2),months:Number(form.elements.months.value||bonus.months||3)};
      T.update(data=>{data.programs.find(item=>item.id===p.id).coinBonus=next},'Lưu thưởng thêm xu của đợt '+p.name);
      closeModal();
      programDetail();
    };
  };

  window.flightOfferForm=id=>{
    const p=targetProgram(),offer=(p.flightOffers||[]).find(item=>item.id===id)||{};
    modal((id?'Chỉnh sửa':'Tạo')+' ưu đãi vé máy bay',`<form id="flightOfferForm">
      ${field('Tên ưu đãi','name','text',offer.name,'required maxlength="100"')}
      ${select('Phạm vi chuyến bay','scope',[['all','Tất cả chuyến bay'],['domestic','Nội địa'],['international','Quốc tế']],offer.scope||'all')}
      ${field('Số tiền giảm trên đơn (đ)','amount','number',offer.amount,'required min="1" step="1"')}
      <p class="muted">Ưu đãi dùng lịch nhận đặt của đợt: ${e(p.start)} → ${e(p.end)}. Chỉ áp dụng cho đơn vé mới khi đợt và ưu đãi đang mở.</p>
      <div id="flightOfferError" class="error"></div>
      <div class="actions"><button type="button" onclick="closeModal()">Hủy</button><button class="primary">Lưu nháp</button></div>
    </form>`);
    document.querySelector('#flightOfferForm').onsubmit=event=>{
      event.preventDefault();
      const data=Object.fromEntries(new FormData(event.target));
      const amount=Number(data.amount);
      if(!data.name.trim()||!Number.isSafeInteger(amount)||amount<1){
        document.querySelector('#flightOfferError').textContent='Nhập tên và số tiền giảm hợp lệ.';
        return;
      }
      T.update(state=>{
        const period=state.programs.find(item=>item.id===p.id);
        period.flightOffers||=[];
        const next={...offer,...data,amount,id:id||crypto.randomUUID(),status:offer.status||'Nháp'};
        period.flightOffers=id?period.flightOffers.map(item=>item.id===id?next:item):[...period.flightOffers,next];
      },'Lưu ưu đãi vé máy bay '+data.name);
      closeModal();
      programDetail();
    };
  };

  window.flightOfferToggle=id=>{
    const p=targetProgram(),offer=(p.flightOffers||[]).find(item=>item.id===id);
    if(!offer)return;
    if(offer.status!=='Đang mở'&&!activePeriod()){toast('Cần mở đợt tiếp thị trước khi mở ưu đãi vé.');return}
    T.update(state=>{
      const item=state.programs.find(x=>x.id===p.id).flightOffers.find(x=>x.id===id);
      item.status=item.status==='Đang mở'?'Tạm ngưng':'Đang mở';
    },'Đổi trạng thái ưu đãi vé máy bay '+offer.name);
    programDetail();
  };

  const originalDetail=programDetail;
  programDetail=function(){
    originalDetail();
    const p=targetProgram();
    if(!p)return;
    const bonus=p.coinBonus||{},offers=p.flightOffers||[];
    const flightRows=offers.map(offer=>`<tr>
      <td>${e(offer.name)}</td><td>${e(scopeLabel[offer.scope]||scopeLabel.all)}</td>
      <td>${number(offer.amount)}đ</td><td>${e(offer.status)}</td>
      <td><button onclick="flightOfferForm('${offer.id}')">Xem / sửa</button> <button onclick="flightOfferToggle('${offer.id}')">${offer.status==='Đang mở'?'Tạm ngưng':'Mở ưu đãi'}</button></td>
    </tr>`).join('')||'<tr><td colspan="5">Chưa có ưu đãi vé máy bay trong đợt này.</td></tr>';
    const flight=`<section class="card"><div class="row"><h2>Ưu đãi vé máy bay</h2><button class="primary" onclick="flightOfferForm()">＋ Tạo ưu đãi vé máy bay</button></div>
      <p class="muted">Bookese cấu hình ưu đãi trên đơn vé; dùng lịch và trạng thái của đợt tiếp thị.</p>
      <table><thead><tr><th>Ưu đãi</th><th>Phạm vi</th><th>Giảm trên đơn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${flightRows}</tbody></table></section>`;
    const bonusDetails=bonus.enabled?`<p><b>${e(bonus.service)}</b> · ${number(bonus.multiplier)}× xu nền · phần thưởng thêm dùng trong ${number(bonus.months)} tháng.</p>
      <p class="muted">Áp dụng cho đơn đủ điều kiện sau khi hoàn tất dịch vụ, khi đợt tiếp thị đang mở.</p>`:'<p class="muted">Chưa áp dụng thưởng thêm xu cho đợt này.</p>';
    const coins=`<section class="card"><div class="row"><h2>Thưởng thêm xu</h2><button class="primary" onclick="coinBonusForm()">${bonus.enabled?'Chỉnh sửa thưởng xu':'＋ Thiết lập thưởng xu'}</button></div>${bonusDetails}</section>`;
    const lodging=[...document.querySelectorAll('#app section.card')].find(section=>section.querySelector('h2')?.textContent==='Ưu đãi giá chỗ nghỉ');
    lodging?.insertAdjacentHTML('afterend',flight+coins);
  };
  if(location.hash==='#program')programDetail();
})();
