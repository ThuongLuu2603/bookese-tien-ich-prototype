/* A marketing period belongs to either lodging or flights. Both can link vouchers. */
(function(){
  const T=BookeseTarget;
  const service=p=>p?.serviceType==='flight'?'flight':'stay';
  const serviceName=p=>service(p)==='flight'?'Vé máy bay':'Lưu trú';
  const number=value=>Number(value||0).toLocaleString('vi-VN');
  const scopes={all:'Tất cả chuyến bay',domestic:'Nội địa',international:'Quốc tế'};

  const previousProgramForm=programForm;
  programForm=function(id){
    previousProgramForm(id);
    const p=T.read().programs.find(item=>item.id===id)||{};
    const form=document.querySelector('#pf');
    const marketFieldset=[...form.querySelectorAll('fieldset')].find(item=>item.querySelector('legend')?.textContent.includes('Thị trường điểm đến'));
    const hasData=!!id&&(T.read().prices.some(item=>item.program===id)||!!p.flightConditions||db.campaigns.some(item=>item.program===id));
    const selector=document.createElement('label');
    selector.className='field';
    selector.innerHTML=`Dịch vụ của đợt tiếp thị<select name="serviceType" ${hasData?'disabled':''}><option value="stay" ${service(p)==='stay'?'selected':''}>Lưu trú</option><option value="flight" ${service(p)==='flight'?'selected':''}>Vé máy bay</option></select>`;
    marketFieldset.before(selector);
    if(hasData)selector.insertAdjacentHTML('beforeend','<small class="muted">Đợt đã có cấu hình liên kết; giữ nguyên dịch vụ.</small>');
    const flightScope=document.createElement('div');
    flightScope.innerHTML=select('Phạm vi chuyến bay','flightScope',Object.entries(scopes),p.flightScope||p.flightConditions?.scope||'all');
    marketFieldset.after(flightScope);
    const toggle=()=>{const flight=form.elements.serviceType.value==='flight';marketFieldset.hidden=flight;flightScope.hidden=!flight;form.elements.flightScope.disabled=!flight;if(flight){form.querySelector('[name="marketScope"][value="all"]').checked=true;marketFieldset.querySelectorAll('[name="markets"]').forEach(input=>input.checked=false)}};
    form.elements.serviceType.onchange=toggle;
    toggle();
    const previousSubmit=form.onsubmit;
    form.onsubmit=event=>{
      const type=form.elements.serviceType.value;
      const scope=form.elements.flightScope.value;
      if(type==='flight'&&p.flightConditions&&window.FlightMarketingConditions){
        const nextProgram={...p,flightScope:scope,start:form.elements.start?.value||p.start,end:form.elements.end?.value||p.end};
        const problem=FlightMarketingConditions.validate(FlightMarketingConditions.normalize(p.flightConditions,nextProgram),nextProgram);
        if(problem){event.preventDefault();toast(problem);return}
      }
      previousSubmit(event);
      if(document.querySelector('#modal').open)return;
      T.update(data=>{const saved=data.programs.find(item=>item.id===programId);saved.serviceType=type;if(type==='flight'){saved.markets=[];saved.flightScope=scope;if(saved.flightConditions)saved.flightConditions.scope=scope}},'Lưu dịch vụ đợt tiếp thị');
      programDetail();
    };
  };

  const previousAction=programAction;
  programAction=function(status){
    const p=targetProgram();
    if(status==='Đang mở'&&p.status==='Chờ duyệt'&&service(p)==='flight'&&!p.flightConditions){toast('Cấu hình điều kiện vé máy bay trước khi duyệt mở đợt.');return}
    previousAction(status);
  };

  window.flightConditionForm=()=>{
    const p=targetProgram(),condition=p.flightConditions||{};
    modal('Điều kiện chương trình tiếp thị vé máy bay',`<form id="flightConditionForm">
      <p class="muted">Bookese cấu hình trực tiếp, không có bước nhà cung cấp đăng ký. Thời gian áp dụng theo đợt ${e(p.start)} → ${e(p.end)}.</p>
      ${select('Chuyến bay áp dụng','scope',[['all','Tất cả chuyến bay'],['domestic','Nội địa'],['international','Quốc tế']],condition.scope||'all')}
      ${select('Hình thức giảm','discountType',[['amount','Giảm số tiền'],['percent','Giảm theo %']],condition.discountType||'amount')}
      ${field('Mức giảm','discount','number',condition.discount||'','required min="1" step="1"')}
      ${field('Giá trị đơn tối thiểu (đ, tùy chọn)','minimum','number',condition.minimum||'','min="0" step="1"')}
      <label class="field" id="flightMaximum">Giảm tối đa (đ)<input name="maximum" type="number" min="1" step="1" value="${e(condition.maximum||'')}"></label>
      <div id="flightConditionError" class="error"></div>
      <div class="actions"><button type="button" onclick="closeModal()">Hủy</button><button class="primary">Lưu điều kiện</button></div>
    </form>`);
    const form=document.querySelector('#flightConditionForm');
    const toggle=()=>{const percent=form.elements.discountType.value==='percent';form.querySelector('#flightMaximum').hidden=!percent;form.elements.maximum.required=percent};
    form.elements.discountType.onchange=toggle;
    toggle();
    form.onsubmit=event=>{
      event.preventDefault();
      const data=Object.fromEntries(new FormData(form));
      const discount=Number(data.discount),minimum=data.minimum===''?0:Number(data.minimum),maximum=data.maximum===''?0:Number(data.maximum);
      if(!Number.isSafeInteger(discount)||discount<1||(data.discountType==='percent'&&discount>99)||!Number.isSafeInteger(minimum)||minimum<0||(data.discountType==='percent'&&(!Number.isSafeInteger(maximum)||maximum<1))){
        form.querySelector('#flightConditionError').textContent='Kiểm tra mức giảm, đơn tối thiểu và mức giảm tối đa.';
        return;
      }
      T.update(state=>{state.programs.find(item=>item.id===p.id).flightConditions={scope:data.scope,discountType:data.discountType,discount,minimum,maximum:data.discountType==='percent'?maximum:null}},'Lưu điều kiện vé máy bay của '+p.name);
      closeModal();
      programDetail();
    };
  };

  window.coinBonusForm=()=>{
    const p=targetProgram(),bonus=p.coinBonus||{};
    modal('Thưởng thêm xu · '+p.name,`<form id="coinBonusForm">
      <label><input type="checkbox" name="enabled" ${bonus.enabled?'checked':''}> Bật thưởng thêm xu cho đợt này</label>
      <p class="muted">Dịch vụ: <b>${serviceName(p)}</b>. Dùng thời gian và trạng thái của đợt tiếp thị: ${e(p.start)} → ${e(p.end)}.</p>
      <div class="fields" id="coinBonusFields">
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
      const enabled=form.elements.enabled.checked,multiplier=Number(form.elements.multiplier.value);
      if(enabled&&(!Number.isInteger(multiplier)||multiplier<2||multiplier>10)){form.querySelector('#coinBonusError').textContent='Hệ số xu phải từ 2 đến 10.';return}
      const next={enabled,service:serviceName(p),multiplier:enabled?multiplier:Number(bonus.multiplier||2),months:Number(form.elements.months.value||bonus.months||3)};
      T.update(data=>{data.programs.find(item=>item.id===p.id).coinBonus=next},'Lưu thưởng thêm xu của đợt '+p.name);
      closeModal();
      programDetail();
    };
  };

  const previousRows=marketingRows;
  marketingRows=function(){
    previousRows();
    const rows=document.querySelectorAll('#marketingRows tr');
    rows.forEach(row=>{
      if(row.classList.contains('empty')||row.cells.length!==7){row.cells[0].colSpan=8;return}
      const button=row.querySelector('button[onclick^="programRoute"]');
      const id=button?.getAttribute('onclick').match(/programRoute\('([^']+)'\)/)?.[1];
      const p=T.read().programs.find(item=>item.id===id);
      if(!p)return;
      row.cells[0].insertAdjacentHTML('afterend',`<td>${serviceName(p)}</td>`);
      if(service(p)==='flight'){
        row.cells[3].textContent=scopes[p.flightScope||p.flightConditions?.scope||'all'];
        row.cells[4].textContent=p.flightConditions?'Đã thiết lập':'Chưa thiết lập';
      }
    });
  };
  const previousMarketing=marketing;
  marketing=function(){
    previousMarketing();
    const head=document.querySelector('#marketingRows')?.closest('table')?.querySelector('thead tr');
    if(!head)return;
    head.cells[0].insertAdjacentHTML('afterend','<th>Dịch vụ</th>');
    head.cells[4].textContent='Ưu đãi / điều kiện';
    head.cells[3].textContent='Phạm vi áp dụng';
  };

  const previousCampaignForm=campaignForm;
  campaignForm=function(){
    previousCampaignForm();
    const form=document.querySelector('#cf');
    if(!form?.elements.program||!form.elements.service)return;
    const existing=!!editing;
    const linked=T.read().programs.find(item=>item.id===form.elements.program.value);
    if(linked&&!existing){form.elements.service.value=service(linked)==='flight'?'flight':'hotel';form.elements.service.dispatchEvent(new Event('change',{bubbles:true}))}
    const oldChange=form.onchange;
    const adjust=()=>{
      const flight=form.elements.service.value==='flight';
      for(const name of ['stayStart','stayEnd']){
        const input=form.elements[name];
        if(input){input.closest('label').hidden=flight;if(flight){input.disabled=true;input.value=''}}
      }
      const hint=form.querySelector('#discountBox .hint');
      if(hint&&flight)hint.textContent='Các điều kiện áp dụng đồng thời. Tính giảm trên giá vé đủ điều kiện, trước xu; một mã Bookese cho một đơn.';
    };
    form.onchange=event=>{
      if(event.target===form.elements.program&&!existing){
        const p=T.read().programs.find(item=>item.id===form.elements.program.value);
        if(p)form.elements.service.value=service(p)==='flight'?'flight':'hotel';
      }
      oldChange?.(event);
      adjust();
    };
    adjust();
    const submit=form.onsubmit;
    form.onsubmit=event=>{
      const p=T.read().programs.find(item=>item.id===form.elements.program.value);
      if(p&&form.elements.service.value!==(service(p)==='flight'?'flight':'hotel')){
        event.preventDefault();
        form.querySelector('#formerror').textContent='Loại dịch vụ của voucher phải khớp với đợt tiếp thị liên kết.';
        return;
      }
      submit(event);
    };
  };

  const previousDetail=programDetail;
  programDetail=function(){
    previousDetail();
    const p=targetProgram();
    if(!p)return;
    const flight=service(p)==='flight',bonus=p.coinBonus||{};
    const cards=[...document.querySelectorAll('#app section.card')];
    const header=cards.find(card=>card.querySelector('h2')?.textContent===p.name);
    const lodging=cards.find(card=>card.querySelector('h2')?.textContent==='Ưu đãi giá chỗ nghỉ');
    const registrations=cards.find(card=>card.querySelector('h2')?.textContent==='Chỗ nghỉ đăng ký');
    if(header){
      header.insertAdjacentHTML('beforeend',`<p><b>Dịch vụ:</b> ${serviceName(p)}</p>`);
      if(flight){const market=[...header.querySelectorAll('p')].find(item=>item.textContent.startsWith('Thị trường:'));market?.remove();header.insertAdjacentHTML('beforeend',`<p><b>Phạm vi chuyến bay:</b> ${e(scopes[p.flightScope||p.flightConditions?.scope||'all'])}</p>`)}
    }
    let preceding=lodging;
    if(flight){
      lodging?.remove();
      registrations?.remove();
      const c=p.flightConditions;
      const description=c?`<p><b>Chuyến bay:</b> ${e(scopes[c.scope]||scopes.all)}</p><p><b>Mức giảm:</b> ${c.discountType==='percent'?`${number(c.discount)}% · tối đa ${number(c.maximum)}đ`:`${number(c.discount)}đ / đơn`}</p><p><b>Đơn tối thiểu:</b> ${c.minimum?number(c.minimum)+'đ':'Không yêu cầu'}</p>`:'<p class="muted">Chưa cấu hình điều kiện vé máy bay. Cần lưu điều kiện trước khi duyệt mở đợt.</p>';
      const panel=`<section class="card"><div class="row"><h2>Điều kiện chương trình tiếp thị vé máy bay</h2><button class="primary" onclick="flightConditionForm()">${c?'Chỉnh sửa điều kiện':'＋ Thiết lập điều kiện'}</button></div><p class="muted">Bookese cấu hình trực tiếp cho vé máy bay; không có nhà cung cấp đăng ký.</p>${description}</section>`;
      header.insertAdjacentHTML('afterend',panel);
      preceding=header.nextElementSibling;
    }
    const details=bonus.enabled?`<p><b>${serviceName(p)}</b> · ${number(bonus.multiplier)}× xu nền · phần thưởng thêm dùng trong ${number(bonus.months)} tháng.</p><p class="muted">Áp dụng sau khi đơn hoàn tất hợp lệ trong thời gian đợt mở.</p>`:'<p class="muted">Chưa áp dụng thưởng thêm xu cho đợt này.</p>';
    preceding?.insertAdjacentHTML('afterend',`<section class="card"><div class="row"><h2>Thưởng thêm xu</h2><button class="primary" onclick="coinBonusForm()">${bonus.enabled?'Chỉnh sửa thưởng xu':'＋ Thiết lập thưởng xu'}</button></div>${details}</section>`);
  };
  if(location.hash==='#program')programDetail();
  if(location.hash==='#marketing')marketing();
})();
