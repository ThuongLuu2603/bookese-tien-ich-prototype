/* Shared navigation for the admin shell and property promotion workspace. */
window.bookeseSidebar=function(property=false){
 const root=property?'intranet.html':'',route=property?'property':location.hash.slice(1).split('?')[0]||'marketing';
 const a=(label,href,active=false,sub=false)=>`<a class="${property?'navitem ':''}${sub?'sub ':''}${active?'active':''}" href="${href}">${label}</a>`;
 const span=label=>`<span class="${property?'navitem':'nav'}">${label}</span>`;
 return '<div class="logo">bookese</div>'+a('▣　Quản lý chỗ nghỉ','promotions.html',property)
 +span('♡　Danh sách yêu thích')
 +a('▤　Quản lý đặt chỗ　⌃',root+'#coin-bookings',route.startsWith('coin-book'))
 +a('Quản lý đặt phòng',root+'#coin-bookings',route==='coin-bookings',true)
 +a('Quản lý đặt vé máy bay',root+'#coin-flights',route==='coin-flights',true)
 +a('♧　Quản lý khách hàng',root+'#coin-customers',route.startsWith('coin-customer'))
 +['▥　Quản lý doanh thu　⌄','☆　Quản lý đánh giá','▧　Quản lý nội dung　⌄','♙　Quản lý tài khoản　⌄','◷　Quản lý thao tác','▱　Quản lý thanh toán'].map(span).join('')
 +a('♧　Quản lý xu',root+'#coins',route==='coins')
 +a('⚙　Quản lý khuyến mãi　⌃',root+'#marketing',['marketing','program','publicity'].includes(route))
 +a('Danh sách Đợt tiếp thị',root+'#marketing',['marketing','program'].includes(route),true)
 +a('Xét duyệt quảng bá giảm sâu',root+'#publicity',route==='publicity',true)
 +span('%　Quản lý thuế')+span('◉　Khám phá　⌄')
 +a('♧　Quà tặng　⌃',root+'#campaigns',['campaigns','campaign','gifts','gift','exchange'].includes(route))
 +a('Quản lý chiến dịch voucher',root+'#campaigns',['campaigns','campaign'].includes(route),true)
 +a('Danh sách quà tặng',root+'#gifts',['gifts','gift'].includes(route),true)
 +a('Danh sách đổi quà',root+'#exchange',route==='exchange',true)
 +span('▱　Quản lý khiếu nại　⌄')+a('Đại sứ &amp; tài trợ','ambassadors.html?role=bookese');
};
