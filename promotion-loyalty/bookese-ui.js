// Presentation adapter for the existing prototype state and policy engine.
// The navigation, list, selection screen and creation form follow the observed Bookese Extranet.
const policyRender = render;
let formGroup = 'condition';
let formType = 'Cơ bản';

document.head.insertAdjacentHTML('beforeend', `<style>
  :root{--blue:#f1870b;--ink:#303a49;--bg:#fafbfe}
  .sidebar{width:70px;padding:12px 7px;background:#292f40;overflow:hidden}
  .sidebar .logo{font-size:0;margin:0 0 20px;text-align:center}
  .sidebar .logo::first-letter{font-size:0}
  .sidebar .logo::after{content:'b';font-size:36px;color:#0875ff;display:block;line-height:44px}
  .sidebar .navitem{height:48px;white-space:nowrap;overflow:hidden;font-size:0;justify-content:center;padding:9px 0;color:#8691a9}
  .sidebar .navitem::first-letter{font-size:19px}
  .sidebar .navitem.active{background:transparent;color:#00b8ef}
  .sidebar .sidecaption,.sidebar .property,.sidebar .sidefoot{display:none}
  .shell{margin-left:70px}.top{height:70px;padding:0 25px}.topnav{gap:27px}.topnav span{font-size:12px}
  main{max-width:none;padding:27px 25px 70px}.prototype{padding:5px 25px;font-size:10px}
  .bookese-crumb{color:#68758b;font-size:13px;margin:4px 0 26px}.bookese-page-title{font-size:16px;letter-spacing:0;font-weight:700;margin:0 0 4px;text-transform:uppercase}
  .bookese-panel{background:#fff;border:1px solid #f0f1f5;border-radius:2px;padding:25px 22px;max-width:1100px}
  .bookese-panel h2{font-size:18px;margin:0}.bookese-tabs{display:flex;gap:28px;border-bottom:1px solid #e5e9f0;margin:20px 0}
  .bookese-tabs button{border:0;border-radius:0;background:transparent;color:#777;padding:10px 18px 12px}
  .bookese-tabs button.active{color:#ef870c;border-bottom:2px solid #ef870c}
  .bookese-create{background:#f28b0b;border-color:#f28b0b;color:#fff;padding:8px 19px;margin:12px 0 3px}
  .bookese-create:hover{background:#e07b00}.bookese-table th{background:#f7f8fb;font-size:13px;color:#303a49}
  .bookese-table td{font-size:13px;padding:18px 12px}.bookese-table tr:hover td{background:#fcfdff}
  .bookese-type{font-size:11px;color:#75839b}.bookese-catalog{display:grid;grid-template-columns:repeat(2,minmax(250px,1fr));gap:13px;margin:20px 0 28px}
  .bookese-option{border:1px solid #e8edf5;padding:17px;display:flex;align-items:center;justify-content:space-between;gap:15px;background:#fff}
  .bookese-option h3{font-size:15px}.bookese-option p{font-size:12px;color:#8490a4;margin:0}
  .bookese-form{max-width:900px}.bookese-form section{border-bottom:1px solid #e8edf3;padding:10px 0 22px}
  .bookese-form h2{font-size:17px}.bookese-form .field{font-size:14px}.bookese-form .field input,.bookese-form .field select{font-size:14px}
  .bookese-form .radio-row{display:flex;gap:22px;flex-wrap:wrap;margin:13px 0}.bookese-form .radio-row label{display:flex;align-items:center;gap:7px}
  .bookese-form .radio-row input{accent-color:#ef870c}.bookese-form .weekday{display:flex;gap:9px;flex-wrap:wrap}
  .bookese-form .weekday label{border:1px solid #dfe6ee;padding:6px 9px}.bookese-form .weekday input{accent-color:#ef870c}
  .bookese-form .actions{display:flex;justify-content:flex-end;gap:12px;margin-top:23px}
  .bookese-form .primary{background:#f28b0b;border-color:#f28b0b}.bookese-form .primary:hover{background:#dc7d05}
  @media(max-width:800px){.bookese-catalog{grid-template-columns:1fr}.topnav{display:none}.mobilebrand{display:block;font-size:21px}.bookese-panel{padding:18px}main{padding:23px 18px 50px}}
</style>`);

// Keep the existing policy-only screens callable for internal validation, but
// use the current product flow as the first screen seen by a user.
render = function () {
  if (!['list', 'catalog', 'form'].includes(view)) return policyRender();
  const titles = { list: 'KHUYẾN MÃI', catalog: 'CHỌN KHUYẾN MÃI MỚI', form: `TẠO ƯU ĐÃI ${formType.toUpperCase()}` };
  const crumbs = { list: 'Chương trình khuyến mãi / Danh sách chương trình khuyến mãi', catalog: 'Chương trình khuyến mãi / Tạo chương trình khuyến mãi', form: `Chương trình khuyến mãi / Tạo chương trình khuyến mãi / Ưu Đãi ${formType}` };
  $('#main').innerHTML = `<h1 class="bookese-page-title">${titles[view]}</h1><div class="bookese-crumb">${crumbs[view]}</div><div id="content"></div>`;
  if (view === 'list') renderBookeseList();
  if (view === 'catalog') renderBookeseCatalog();
  if (view === 'form') renderBookeseForm();
};

function renderBookeseList() {
  const visible = data.items.filter(p => (filter === 'active' ? p.status === 'active' || p.status === 'paused' : p.status === filter));
  $('#content').innerHTML = `<div class="bookese-panel"><h2>Khuyến mãi của Bạn</h2><div class="muted">Xem lại, quản lý và chọn khuyến mãi mới.</div><button class="bookese-create" onclick="go('catalog')">✚ &nbsp; Tạo khuyến mãi mới</button><div class="bookese-tabs">${[['active','Đang hoạt động'],['upcoming','Sắp diễn ra'],['ended','Đã kết thúc']].map(([k,n])=>`<button class="${filter===k?'active':''}" onclick="filter='${k}';render()">${n}</button>`).join('')}</div><div class="tablewrap"><table class="bookese-table"><thead><tr><th>Tên khuyến mãi</th><th>Thời gian đặt</th><th>Thời gian lưu trú</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${visible.map(p=>`<tr><td><b>${esc(p.name)}</b><br><span class="bookese-type">${esc(p.type)}</span></td><td>${p.start || '—'} – ${p.end || '—'}</td><td>${p.stayStart || '—'} – ${p.stayEnd || '—'}</td><td>${labels[p.status]||p.status}</td><td><button class="quiet" onclick="edit(${p.id})">Xem / sửa</button> <button class="quiet" onclick="toggle(${p.id})">${p.status==='paused'?'Tiếp tục':'Tạm ngưng'}</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">Chưa có khuyến mãi trong trạng thái này.</td></tr>'}</tbody></table></div></div>`;
}

function renderBookeseCatalog() {
  const sections = [
    ['Ưu đãi phổ biến', 'Cải thiện tình trạng lấp đầy phòng trống với các ưu đãi có thể tùy chỉnh.', [['condition','Cơ bản','Bất cứ ngày nào'],['condition','Phút chót','Giúp lấp phòng trống còn lại'],['condition','Đặt sớm','Thu hút khách có kế hoạch sớm'],['condition','Dài hạn','Phù hợp kỳ lưu trú dài']]],
    ['Ưu đãi tài khoản', 'Giảm giá cho nhóm khách cụ thể.', [['member','Du khách','Giá thành viên theo loại giá'],['member','Đại lý','Theo chính sách đối tác'],['member','Đại sứ','Theo chính sách đối tác']]],
    ['Ưu đãi giới hạn', '', [['exclusive','Thứ hạng','Theo đợt và hạn lượng phòng']]],
    ['Đợt tiếp thị', 'Chỗ nghỉ tham gia khung chiến dịch do Bookese mở.', [['campaign','Tiếp thị','Đăng ký trong khung đã duyệt']]],
    ['Ưu đãi trên di động', '', [['market','Di động','Web di động và ứng dụng']]]
  ];
  $('#content').innerHTML = `<div class="bookese-panel">${sections.map(([heading,intro,options])=>`<section><h2>${heading}</h2>${intro?`<p class="muted small">${intro}</p>`:''}<div class="bookese-catalog">${options.map(([g,t,desc])=>`<div class="bookese-option"><div><h3>Ưu Đãi ${t}</h3><p>${desc}</p></div><button class="quiet" onclick="edit(null,'${g}','${t}')">✚ Tạo</button></div>`).join('')}</div></section>`).join('')}<button onclick="go('list')">Quay lại danh sách</button></div>`;
}

edit = function (id, group='condition', type='Cơ bản') {
  if(group==='member'){location.href=type==='Đại lý'||type==='Đại sứ'?'intranet.html#coins':'index.html#offers';return;}
  const p = id ? data.items.find(x=>x.id===id) : null;
  editing = id;
  formGroup = p?.group || group;
  formType = p?.type || type;
  view = 'form';
  render();
};

function renderBookeseForm() {
  const p = editing ? data.items.find(x=>x.id===editing) : null;
  const v = p || {name:'',rate:10,room:'all',threshold:3,start:'',end:'',stayStart:'',stayEnd:'',status:'active',wholeStay:false,channel:'both'};
  $('#content').innerHTML = `<form class="bookese-panel bookese-form" id="realForm"><h2>${editing?'Chỉnh sửa':'Tạo'} Ưu Đãi ${formType}</h2><p class="muted">Chọn ngày, mức giảm giá, đối tượng áp dụng và phạm vi phòng.</p><section><h2>Thông tin chi tiết về khuyến mãi</h2><div class="field">Loại giá nào sẽ được áp dụng khuyến mãi này?</div><div class="radio-row"><label><input type="radio" name="priceScope" value="all" ${v.room==='all'?'checked':''}> Tất cả loại giá</label><label><input type="radio" name="priceScope" value="choose" ${v.room!=='all'?'checked':''}> Chọn loại giá</label></div><label class="field">Loại giá<select name="room"><option value="all">Tất cả loại giá</option><option value="deluxe" ${v.room==='deluxe'?'selected':''}>Deluxe · Linh hoạt</option><option value="suite" ${v.room==='suite'?'selected':''}>Suite · Linh hoạt</option></select></label><div class="field">Phòng nào sẽ được áp dụng?</div><div class="radio-row"><label><input type="radio" name="roomScope" value="all" checked> Tất cả phòng có loại giá đã chọn</label><label><input type="radio" name="roomScope" value="choose"> Chọn phòng</label></div><label class="field">Bạn muốn áp dụng giảm giá bao nhiêu % *<input type="number" name="rate" min="1" max="99" step="1" value="${v.rate}" required></label>${['Phút chót','Đặt sớm','Dài hạn'].includes(formType)?`<label class="field">${formType==='Dài hạn'?'Số đêm tối thiểu':formType==='Phút chót'?'Đặt trước tối đa (ngày)':'Đặt trước tối thiểu (ngày)'}<input type="number" name="threshold" min="${formType==='Dài hạn'?1:0}" max="365" value="${v.threshold||3}"></label>`:''}${formType==='Di động'?`<label class="field">Kênh áp dụng<select name="channel"><option value="both" ${v.channel==='both'?'selected':''}>Web di động và ứng dụng</option><option value="web-mobile" ${v.channel==='web-mobile'?'selected':''}>Chỉ web di động</option><option value="app" ${v.channel==='app'?'selected':''}>Chỉ ứng dụng</option></select></label>`:''}${formType==='Thứ hạng'?`<div class="formgrid"><label class="field">Bắt đầu đợt nhận đặt<input type="datetime-local" name="boostStart" value="${v.boostStart||''}" required></label><label class="field">Kết thúc đợt nhận đặt<input type="datetime-local" name="boostEnd" value="${v.boostEnd||''}" required></label></div><label class="field">Hạn lượng phòng ưu đãi<input type="number" name="inventory" min="1" step="1" value="${v.inventory||10}" required></label>`:''}</section><section><h2>Ngày lưu trú</h2><div class="formgrid"><label class="field">Thời gian đặt từ *<input type="date" name="start" value="${v.start}" required></label><label class="field">Đến *<input type="date" name="end" value="${v.end}" required></label><label class="field">Thời gian lưu trú từ *<input type="date" name="stayStart" value="${v.stayStart}" required></label><label class="field">Đến *<input type="date" name="stayEnd" value="${v.stayEnd}" required></label></div><div class="field">Bạn muốn áp dụng khuyến mãi này vào ngày nào trong tuần?</div><div class="weekday">${['CN','T2','T3','T4','T5','T6','T7'].map((d,i)=>`<label><input type="checkbox" name="weekday" value="${i}" ${(v.weekdays||[0,1,2,3,4,5,6]).includes(i)?'checked':''}> ${d}</label>`).join('')}</div><label class="field">Áp dụng theo kỳ lưu trú<select name="wholeStay"><option value="false">Giảm từng đêm đủ điều kiện</option><option value="true" ${v.wholeStay?'selected':''}>Cả kỳ lưu trú phải hợp lệ</option></select></label></section><section><h2>Tên khuyến mãi</h2><p class="small muted">Tên này chỉ hiển thị trong trang quản lý của chỗ nghỉ.</p><label class="field">Tên khuyến mãi<input name="name" value="${esc(v.name)}" maxlength="100" required></label></section><div id="formerror" class="error" role="alert"></div><div class="actions"><button type="button" onclick="go('list')">Hủy</button><button class="primary" type="submit">${editing?'Lưu thay đổi':'Tạo'}</button></div></form>`;
  $('#realForm').onsubmit = saveBookeseForm;
  const scope = $('#realForm').elements.priceScope;
  const ratePlan = $('#realForm').elements.room;
  [...scope].forEach(radio => radio.addEventListener('change', () => {
    if (radio.checked && radio.value === 'all') ratePlan.value = 'all';
    if (radio.checked && radio.value === 'choose' && ratePlan.value === 'all') ratePlan.value = 'deluxe';
  }));
  ratePlan.addEventListener('change', () => {
    scope.value = ratePlan.value === 'all' ? 'all' : 'choose';
  });
}

function saveBookeseForm(event) {
  event.preventDefault();
  const f = Object.fromEntries(new FormData(event.target));
  if (f.end < f.start || f.stayEnd < f.stayStart) { $('#formerror').textContent = 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.'; return; }
  if (formType === 'Thứ hạng') {
    const start = new Date(f.boostStart), end = new Date(f.boostEnd);
    const hours = (end - start) / 3600000;
    const conflict = data.items.some(x => x.id !== editing && x.type === 'Thứ hạng' && x.boostStart && Math.abs(start - new Date(x.boostStart)) < 14 * 86400000);
    if (hours <= 0 || hours > 72 || conflict) { $('#formerror').textContent = conflict ? 'Mỗi chỗ nghỉ chỉ có một đợt trong chu kỳ 14 ngày.' : 'Đợt nhận đặt phải dài tối đa 72 giờ.'; return; }
  }
  const prior = editing ? data.items.find(x=>x.id===editing) : {};
  const weekdays = [...new FormData(event.target).getAll('weekday')].map(Number);
  if (!weekdays.length) { $('#formerror').textContent = 'Chọn ít nhất một ngày trong tuần.'; return; }
  const item = {...prior,...f,id:editing||Date.now(),group:formGroup,type:formType,rate:Number(f.rate),threshold:Number(f.threshold||prior.threshold||0),wholeStay:f.wholeStay==='true',weekdays,status:prior.status||'active'};
  if (editing) data.items = data.items.map(x=>x.id===editing?item:x); else data.items.push(item);
  view = 'list'; filter = item.status === 'paused' ? 'active' : item.status;
  persist(`${editing?'Sửa':'Tạo'}: ${item.name}`);
}

render();

// Match the full Bookese navigation observed on intranet, 18 September 2026.
document.head.insertAdjacentHTML('beforeend',`<style>
:root{--bg:#f7f7fb;--blue:#00b9ed}.sidebar{width:250px;padding:13px 0;overflow:auto}.sidebar .logo{font-size:39px;margin:0 45px 23px;text-align:left;letter-spacing:-2px}.sidebar .logo::after{content:none}.sidebar .navitem{font-size:13px;height:auto;justify-content:flex-start;padding:11px 24px}.sidebar .navitem::first-letter{font-size:13px}.shell{margin-left:250px}.bookese-panel{max-width:none;border:0;border-radius:3px}.bookese-catalog{grid-template-columns:1fr}.bookese-option{min-height:96px;padding:20px 28px}.bookese-form{max-width:800px;margin:auto}.bookese-form .primary{background:#00b9ed;border-color:#00b9ed}.topnav{font-size:13px}.sidebar .sub{padding:7px 30px 7px 55px;font-size:12px}.sidebar .navitem{display:block;color:#a5aec6}.sidebar .navitem.active{color:#00b9ed}.sidebar .navitem:hover{background:#323b4e}@media(max-width:800px){.sidebar{width:190px}.sidebar .logo{margin-left:24px}.shell{margin-left:190px}}@media(max-width:650px){.sidebar{display:none}.shell{margin-left:0}}
</style>`);
document.querySelector('.sidebar').innerHTML=bookeseSidebar(true);
document.querySelector('#quicknav').href='intranet.html#campaigns';document.querySelector('#quicknav').textContent='Mở Intranet · Chiến dịch voucher →';
const currentCatalog=renderBookeseCatalog;renderBookeseCatalog=function(){currentCatalog();document.querySelectorAll('.bookese-option h3').forEach(h=>{if(h.textContent==='Ưu Đãi Du khách')h.textContent='Giá thành viên';});document.querySelectorAll('.bookese-option').forEach(row=>{if(/Ưu Đãi Đại lý|Ưu Đãi Đại sứ/.test(row.textContent)){row.querySelector('button').textContent='Xem chính sách';row.querySelector('p').textContent='Thù lao quản lý tại Quản lý xu';}})};
