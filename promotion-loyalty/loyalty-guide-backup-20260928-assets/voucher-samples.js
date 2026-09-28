function voucherSamples(){
 const base={owner:'Bookese · dữ liệu mẫu',start:'2026-01-01',end:'2027-12-31',expiry:'2028-01-31',status:'Đang chạy',version:1,program:'',kind:'promo',discount:'amount',value:50000,cap:50000,min:0,budget:10000000,quota:20,perUser:1,distribution:'personal',codes:[],issued:[],audience:'all',tier:'all',channel:'all'};
 for(const c of [{...base,id:'voucher-coin-demo',name:'BOOKESE đổi xu · mẫu',voucherType:'BOOKESE',issueMode:'exchange'},{...base,id:'voucher-cs-demo',name:'BOOKESE CS cấp bù · mẫu',voucherType:'BOOKESE',issueMode:'direct'},{...base,id:'voucher-partner-demo',name:'Giftcode ăn uống khách sạn · mẫu',voucherType:'PARTNER',kind:'gift',distribution:'inventory',partner:'Khách sạn mẫu',terms:'Một suất ăn cho một khách, đặt trước với khách sạn.',codes:['HOTELGIFT01','HOTELGIFT02','HOTELGIFT03']}])if(!db.campaigns.some(x=>x.id===c.id))db.campaigns.push(structuredClone(c));
 for(const [id,campaign,name] of [['gift-coin-demo','voucher-coin-demo','Voucher Bookese 50.000đ'],['gift-partner-demo','voucher-partner-demo','Voucher ăn uống khách sạn']])if(!db.gifts.some(x=>x.id===id))db.gifts.push({id,campaign,name,price:1000,limit:2,status:'Công khai',description:name,usage:'Nhận mã trong Quà của tôi sau khi đổi xu.',terms:'Một mã dùng một lần, trong thời hạn voucher.'});
 save('Thêm ví dụ ba luồng voucher');campaigns();
}
const voucherCampaignList=campaigns;
campaigns=function(){voucherCampaignList();$('#app').insertAdjacentHTML('beforeend','<p class="muted">Dữ liệu bản thử: <button onclick="voucherSamples()">Tạo ví dụ BOOKESE / CS / PARTNER</button></p>')};
nav();
