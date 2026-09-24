/* Coin bonus is an optional setting of the existing marketing period. */
(function(){
  const T=BookeseTarget;
  const originalForm=programForm;
  programForm=function(id){
    originalForm(id);
    const p=T.read().programs.find(item=>item.id===id)||{};
    const bonus=p.coinBonus||{};
    const form=document.querySelector('#pf');
    form.querySelector('.actions').insertAdjacentHTML('beforebegin',`
      <fieldset class="coin-bonus-settings">
        <legend>Thưởng thêm xu</legend>
        <label><input type="checkbox" name="coinBonusEnabled" ${bonus.enabled?'checked':''}> Áp dụng cho đợt tiếp thị này</label>
        <p class="muted">Đơn đặt trong thời gian của đợt sẽ nhận thêm xu sau khi hoàn tất dịch vụ.</p>
        <div class="fields">
          ${select('Dịch vụ','coinBonusService',[['Lưu trú','Lưu trú'],['Vé máy bay','Vé máy bay']],bonus.service||'Lưu trú')}
          ${field('Hệ số xu','coinBonusMultiplier','number',bonus.multiplier||2,'min="2" max="10" step="1"')}
          ${select('Hạn dùng phần xu thưởng thêm','coinBonusMonths',[['3','3 tháng'],['4','4 tháng'],['5','5 tháng'],['6','6 tháng']],String(bonus.months||3))}
        </div>
      </fieldset>`);
    const enabled=form.elements.namedItem('coinBonusEnabled');
    const fields=['coinBonusService','coinBonusMultiplier','coinBonusMonths'].map(name=>form.elements.namedItem(name));
    const toggle=()=>fields.forEach(input=>input.disabled=!enabled.checked);
    enabled.onchange=toggle;
    toggle();
    const submit=form.onsubmit;
    form.onsubmit=event=>{
      const active=enabled.checked;
      const multiplier=Number(form.elements.namedItem('coinBonusMultiplier').value);
      if(active&&(!Number.isInteger(multiplier)||multiplier<2||multiplier>10)){
        event.preventDefault();
        form.querySelector('#pfError').textContent='Hệ số xu phải từ 2 đến 10.';
        return;
      }
      const next={enabled:active,service:form.elements.namedItem('coinBonusService').value||bonus.service||'Lưu trú',multiplier:active?multiplier:Number(bonus.multiplier||2),months:Number(form.elements.namedItem('coinBonusMonths').value||bonus.months||3)};
      submit(event);
      if(document.querySelector('#modal').open)return;
      T.update(data=>{data.programs.find(item=>item.id===programId).coinBonus=next},'Lưu thưởng thêm xu trong đợt tiếp thị');
      programDetail();
    };
  };
  const originalDetail=programDetail;
  programDetail=function(){
    originalDetail();
    const p=targetProgram();
    if(!p)return;
    const b=p.coinBonus;
    const text=b?.enabled?`${e(b.service)} · ${Number(b.multiplier)}× xu nền · hạn phần thưởng thêm ${Number(b.months)} tháng`:'Không áp dụng';
    document.querySelector('#app section.card').insertAdjacentHTML('beforeend',`<p><b>Thưởng thêm xu:</b> ${text}</p>`);
  };
  if(location.hash==='#program')programDetail();
})();
