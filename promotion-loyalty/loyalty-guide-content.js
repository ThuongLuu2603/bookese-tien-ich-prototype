/* Presentation supplement only. Operational screens and coin accounting stay unchanged. */
(function () {
  'use strict';
  const oldCoins = coins, oldGo = window.coinGo;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const p = s => `<p>${esc(s)}</p>`;
  const list = a => `<ul>${a.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  const table = (heads, rows) => `<div class="guide-table"><table><thead><tr>${heads.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(s=>`<td>${esc(s)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const card = (name, body, source='Đặc tả “Cơ chế tính xu” và các quyết định đã chốt.') => `<section class="card guide-section"><h2>${esc(name)}</h2>${body}<p class="guide-source">Nguồn: ${esc(source)}</p></section>`;
  const proposal = 'Đề án Hạng thành viên & Loyalty — bản đầy đủ. Các chỉ tiêu, ngân sách và thời gian là giả định/kế hoạch đề xuất, cần phê duyệt trước khi áp dụng.';
  const groups = [
    ['Định hướng', [['overview','Tổng quan PA-C'],['roadmap','Triển khai thực tế'],['economics','Chi phí & chỉ số']]],
    ['Khách hàng', [['policy','Tích & dùng xu'],['members','Hạng thành viên'],['rewards','Thưởng & CRM'],['journey','Vòng đời & ví dụ']]],
    ['Vận hành', [['wallets','Ví & lô xu'],['history','Giao dịch'],['refund','Hoàn & thu hồi'],['partner','Đại lý & Đại sứ'],['sources','Nguồn & điểm cần chốt']]]
  ];
  const extras = {};
  extras.policy = () => card('Ba quyền lợi khác nhau', table(['Quyền lợi','Khi nào khách hưởng?','Ví dụ'],[
    ['Giá thành viên','Giảm ngay vào giá phòng đủ điều kiện; do chỗ nghỉ cấu hình.','10% cho các hạng; mức 15% dành cho Trung thành thay mức 10%, không cộng thành 25%.'],
    ['Voucher và xu thanh toán','Trừ tại bước thanh toán sau ưu đãi dịch vụ.','Mỗi ưu đãi trình bày riêng số tiền giảm; không cộng gộp các ưu đãi thành một nhãn.'],
    ['Xu nhận sau dịch vụ','Ghi nhận xu chờ khi đặt; chỉ được dùng sau khi hoàn tất.','Thành viên nhận 1% tiền thực trả lưu trú; không trừ khoản xu tương lai vào tổng phải trả.']
  ]) + p('Ưu đãi độc quyền nhánh A không cộng giá thành viên; nhánh B/C kết hợp theo chính sách giá đã chốt. Chính sách xu khách lẻ áp dụng như nhau cho nguồn Extranet và Ohmyhotel; biên lợi nhuận nguồn cung được theo dõi riêng.'));
  extras.members = () => card('Ví dụ lên hạng và giữ mức đã chốt', list([
    '3 đơn lưu trú hoàn tất + 2 chặng bay hoàn tất = 4 điểm tích lũy → Thân thiết. Chi tiêu xu không làm giảm điểm xét hạng.',
    'Trung thành cần 8 điểm trong 12 tháng gần nhất. Nếu không đủ, áp dụng ân hạn 1 quý; hết ân hạn vẫn không đạt thì về Thân thiết.',
    'Đơn đặt ở hạng Thành viên giữ mức hoàn đã chốt. Khi sửa đơn trước hoàn tất, xét mức cao hơn giữa mức đã chốt và hạng hiện tại; không tự nâng mức cho mọi đơn cũ.',
    'Đơn hủy/no-show không cộng điểm; sửa cùng một đơn không được tính thêm điểm. Đơn dùng xu vẫn tính điểm khi hoàn tất.',
    'Hạng, điểm tích lũy và xu là ba thông tin riêng. Lịch sử phải cho biết ngày đổi hạng và lý do.'
  ]));
  extras.rewards = () => card('Thưởng thêm xu trong đợt tiếp thị', table(['Thiết lập','Cách áp dụng'],[
    ['Vị trí','Quản lý khuyến mãi → Danh sách Đợt tiếp thị → Chi tiết đợt → Thưởng thêm xu. Dùng loại dịch vụ và phạm vi của đợt.'],
    ['Nội dung','Bật/tắt thưởng, hệ số thưởng, lịch nhận đặt và hạn phần xu thưởng thêm 3–6 tháng.'],
    ['Cách tính','Xu thưởng thêm = xu nền × (hệ số − 1). Xu nền và xu thưởng thêm ghi thành các lô riêng theo hạn dùng.'],
    ['Ví dụ lưu trú','Thực trả 1.000.000đ, Thành viên 1%, chương trình ×2: 10.000 xu nền + 10.000 xu thưởng thêm; chỉ nhận khi hoàn tất.'],
    ['Vé máy bay','Sau khi tính thưởng vẫn phải giữ trần tổng xu bay theo phí dịch vụ từng chặng.'],
    ['Trùng chương trình','Kiểm phạm vi và lịch trước khi mở để tránh thưởng lặp; lưu chương trình đã áp dụng trên đơn/giao dịch.']
  ])) + card('Chăm sóc khách theo từng thời điểm', table(['Thời điểm','Thông điệp / hành động'],[
    ['Sau đặt','Thông báo số xu chờ và điều kiện nhận.'],['Sau hoàn tất','Thông báo xu đã nhận; mời đánh giá lưu trú, thưởng 1.000 xu một lần/đơn cho đánh giá hợp lệ. Không phụ thuộc điểm đánh giá cao hay thấp.'],
    ['Không quay lại 30–45 ngày','Nhắc số dư và gợi ý ưu đãi phù hợp.'],['Trước xu hết hạn 60 / 30 / 7 ngày','Thông báo số xu và ngày hết hạn, dẫn đến Lịch sử xu hoặc Đổi quà.'],
    ['Trước nguy cơ rớt hạng 60 ngày','Thông báo tiến độ giữ hạng và hạn cần đạt.'],['Giới thiệu bạn','Thưởng người mời 50.000 xu khi người được mời hoàn tất đơn đầu; một tầng, một lần/người mới.']
  ]) + p('Đề án có phương án khởi động ×2 trong 60–90 ngày và voucher chào mừng 50.000đ. Đây là chiến dịch cần cấu hình, duyệt riêng; voucher không phải xu và không mặc định phát cho mọi tài khoản.'), proposal);
  extras.wallets = () => card('Cách đọc số dư', list([
    'Số dư xu thể hiện tổng sau các giao dịch đã ghi nhận, có thể âm khi thu hồi xu đã bị sử dụng. Không tạo thêm ô “Xu cần bù trừ”.',
    'Ví dụ còn 5.000 xu nhưng cần thu hồi 8.000 xu: số dư −3.000. Lần sau nhận 10.000 xu thì số dư còn 7.000; trong lúc số dư không dương không dùng xu thanh toán/đổi quà.',
    'Xu chờ không cộng vào số dư. Xu sắp hết hạn là một phần số dư hiện có, không cộng thêm lần nữa.',
    'Hạn mức thanh toán tháng là giới hạn sử dụng, không phải số dư. Đổi quà áp dụng giá xu, tồn kho và giới hạn đổi của quà.',
    'Mỗi lô giữ nguồn, ngày nhận, hạn dùng, số xu còn lại. Dùng lô hết hạn sớm trước; nếu cùng hạn, dùng lô nhận trước.'
  ]));
  extras.history = () => card('Một giao dịch, nhiều nơi cùng đối chiếu', p('Lịch sử xu toàn hệ thống, hồ sơ khách, chi tiết đơn, lượt đổi quà và lịch sử xu phía khách dùng cùng mã giao dịch. Không sửa/xóa giao dịch đã ghi nhận; điều chỉnh tạo giao dịch mới liên kết bản gốc, có người thực hiện và lý do.') + table(['Sự kiện','Ảnh hưởng'],[
    ['Đặt đơn','Tạo xu chờ; chưa tăng số dư.'],['Hoàn tất dịch vụ','Chuyển xu chờ thành xu nhận, không cộng cả hai lần.'],['Thanh toán / đổi quà','Trừ số xu đã dùng; giao dịch thất bại không để lại khoản trừ.'],['Hoàn xu đã dùng','Cộng lại theo phần được hoàn, gắn đơn/lượt đổi và giao dịch gốc.'],['Thu hồi xu thưởng','Trừ xu thưởng không còn đủ điều kiện; có thể làm số dư âm.'],['Hết hạn','Trừ phần còn lại của lô hết hạn.'],['Điều chỉnh được duyệt','Cộng/trừ đúng số chênh lệch, ghi người thao tác và lý do.']
  ]));
  extras.refund = () => card('Ví dụ hoàn một phần và sửa đơn', table(['Tình huống','Kết quả'],[
    ['Đã dùng 100.000 xu, nhận 8.340 xu; hoàn 50%','Trả 50.000 xu đã dùng theo hạn lô gốc và thu hồi 4.170 xu thưởng. Đây là hai giao dịch khác nhau.'],
    ['Sau đó tổng tỷ lệ hoàn tăng lên 80%','Tổng phải trả 80.000, đã trả 50.000 → trả thêm 30.000. Tổng thu hồi 6.672, đã thu 4.170 → thu thêm 2.502.'],
    ['Hoàn vào tháng sau tháng dùng xu','Trả xu còn hạn theo quy tắc; không tăng thêm hạn mức thanh toán tháng mới.'],
    ['Sửa đơn làm giảm trần sử dụng xu','Giữ tối đa số xu đã dùng trong trần mới và tiền còn trả; trả phần dư. Không tự trừ thêm xu khi giá tăng.'],
    ['Đổi chặng bay / phí dịch vụ','Tính lại xu chờ theo từng chặng thay đổi và trần phí dịch vụ; không cộng lại điểm cho cùng chặng hoàn tất.']
  ]) + p('Khi lô đã hết hạn: khách chủ động hủy không được gia hạn; lỗi dịch vụ tạo lô bù hạn 30 ngày theo quy trình, liên kết giao dịch gốc. Ngoại lệ CS cần lý do và phê duyệt.'));
  extras.partner = () => card('Tách ba nguồn quyền lợi của đối tác', table(['Nguồn','Đặc điểm'],[
    ['Xu khách lẻ','Tích khi tự sử dụng dịch vụ; không rút tiền.'],['Thù lao theo đơn','Theo kênh đặt hộ/link/mã và đơn hoàn tất; theo dõi riêng, chịu hoàn/thu hồi và điều kiện chi trả.'],['Tài trợ nội dung Đại sứ','Theo hợp đồng, sản phẩm nội dung và nghiệm thu; không tự cộng như xu đặt phòng.']
  ]) + p('Bậc đại lý theo đặc tả đã chốt là 60/120 đơn hoàn tất quý; không dùng lại mốc 130 từ nội dung cũ. Duy trì 30 đơn/quý và giá trị bình quân từ 1,2 triệu; 20 đơn chỉ là nhắc tiến độ. Thay bậc áp quý kế tiếp, không hồi tố.')) + card('Phương án tài trợ Đại sứ trong đề án', table(['Phương án dự kiến','Điều kiện đề xuất'],[
    ['5 triệu/tháng','Ít nhất 4 nội dung/tháng, gồm 2 video và 2 bài/story; nghiệm thu trước chi trả.'],['10 triệu/tháng','Ít nhất 6 nội dung/tháng.'],['Gia hạn theo hiệu quả','Mốc đề xuất 60/110 đơn/quý; tăng 65/115 nếu mức xu khách bình quân vượt 2%. Quý đầu là thử nghiệm.'],['Thiếu sản phẩm','Giảm chi trả theo phần chưa nghiệm thu; không đạt 2 tháng thì xem xét dừng.'],['Đồng tài trợ lưu trú','Dự kiến 2–4 đêm/quý, 3–5 Đại sứ năm đầu; theo hợp đồng riêng.']
  ]) + p('Các gói tài trợ này là kế hoạch kinh doanh cần duyệt. Giai đoạn 1 chưa mở ghi nhận thù lao/rút tiền đối tác; không áp các gói này như chính sách xu khách lẻ.'), proposal);

  const views = {};
  views.overview = () => card('PA-C: giảm ngay để dễ đặt, tích xu để quay lại', p('Phương án PA-C kết hợp giá thành viên do chỗ nghỉ tài trợ với mức hoàn xu lưu trú 1% / 2% / 3%. Khách nhìn thấy lợi ích ngay khi đặt và có xu để thanh toán hoặc đổi quà ở lần sau.') + table(['Thành phần','Vai trò'],[
    ['Giá thành viên','Tăng sức cạnh tranh của giá bán; quyền lợi theo cấu hình chỗ nghỉ.'],['Xu và hạng','Khuyến khích hoàn tất dịch vụ, đặt lại và tăng gắn bó.'],['Referral / đánh giá / chiến dịch','Thu hút khách mới, tạo nội dung và kích hoạt từng đợt có kiểm soát.'],['Đại lý / Đại sứ','Kênh phân phối giai đoạn sau, có thù lao và đối soát riêng.']
  ]), proposal) + card('Phạm vi triển khai đã chốt', table(['Giai đoạn 1 — khách lẻ','Giai đoạn 2 — đối tác'],[
    ['Hạng thành viên; giá thành viên; tích/dùng xu; đổi quà; giới thiệu; đánh giá; thưởng chiến dịch.','Attribution đơn; bậc đại lý; thù lao; hợp đồng; đối soát và chi trả.'],
    ['Khóa khả năng phát sinh thù lao/rút tiền ở hệ thống, không chỉ ẩn nút.','Chỉ mở khi các điều kiện kiểm soát và thử nghiệm đã đạt; có thể mở ghi nhận trước chi trả.']
  ]) + p('1 xu = 1đ; xu khách lẻ không nạp mua, không chuyển giữa tài khoản, không rút tiền và không dùng ngoài hệ sinh thái. Tham quan chưa được đặc tả cơ chế tích xu trong đề án này.')) + card('Đọc bản trình bày', p('Các mục Khách hàng giải thích quyền lợi và cách tính. Các mục Vận hành có ví dụ và công cụ tính thử. “Triển khai thực tế” chỉ rõ màn hình cần bổ sung; “Chi phí & chỉ số” giữ riêng các giả định kinh doanh.') + p('Đây là bản trình bày trên đường dẫn cũ. Dữ liệu tính thử minh họa ngày 23/09/2026; không thay ngày mô phỏng Flash Sale ở prototype và không ghi giao dịch thật.'));
  views.journey = () => card('Vòng đời của một khoản xu', table(['Bước','Số dư / xử lý','Khách nhìn thấy'],[
    ['1. Đặt dịch vụ','Lưu mức/hạng/kênh/điều kiện tại lúc đặt; tạo xu chờ.','Xu dự kiến và điều kiện nhận.'],['2. Hoàn tất','Lưu trú ghi nhận sau hoàn tất; bay theo từng chặng hoàn tất. Làm tròn xuống, không cấp trùng.','Xu đã nhận và ngày hết hạn.'],['3. Sử dụng','Trừ xu theo hạn lô sớm trước; kiểm số dư, hạn mức và điều kiện giao dịch.','Xu dùng thanh toán hoặc đổi quà.'],['4. Hủy / hoàn / sửa','Hủy xu chờ hoặc tạo giao dịch trả/thu hồi theo trạng thái thực tế.','Lý do, đơn liên quan và số xu cộng/trừ.'],['5. Hết hạn','Chỉ hết hạn số còn lại của lô; nhắc trước 60/30/7 ngày.','Ngày hết hạn và số xu bị trừ.']
  ])) + card('Một đơn lưu trú từ thanh toán đến nhận xu', table(['Khoản','Số tiền / xu'],[
    ['Tổng sau ưu đãi dịch vụ, đã gồm thuế/phí','1.134.000đ'],['Voucher','−200.000đ'],['Xu dùng','−100.000 xu'],['Khách thực trả','834.000đ'],['Xu Thành viên 1% sau hoàn tất','8.340 xu'],['Trần theo tỷ lệ để dùng xu','30% × 1.134.000 = 340.200 xu; còn bị giới hạn bởi số dư, 2 triệu/đơn, 5 triệu/tháng và tiền phải trả.']
  ]) + p('Thuế/phí tách trong Chi tiết giá là cấu thành tổng đã có, không cộng lần hai. Nếu thực trả bằng 0 thì xu hoàn bằng 0.')) + card('Vé máy bay: so sánh các kênh trên cùng một chặng', p('Ví dụ chặng nội địa, phí dịch vụ 40.000đ → trần tổng xu/thù lao là 20.000. Khách ở hạng Thành viên; các kênh đối tác là minh họa giai đoạn 2.') + table(['Kênh','Khách nhận','Đối tác nhận'],[
    ['Khách tự đặt','10.000 xu','0'],['Đại lý đặt hộ','0','min(25.000; 20.000) = 20.000'],['Khách đặt qua link/mã','10.000 xu trước','20.000 − 10.000 = 10.000']
  ]) + p('Với khách Trung thành tự đặt, mức 20.000 vừa bằng trần. Nếu phí chỉ 20.000đ thì trần còn 10.000 và khách chỉ nhận 10.000. Vé khứ hồi xét/ghi nhận từng chặng hoàn tất; không phát toàn bộ xu ngay khi xuất vé. Xu quốc tế theo bảng mức ×3 nhưng vẫn kiểm trần phí từng chặng.'));
  views.roadmap = () => card('Bổ sung vào đúng màn Bookese đang có', table(['Nơi triển khai','Nội dung cần làm'],[
    ['Intranet → Quản lý xu → Chính sách quy đổi','Admin thiết lập tỷ lệ/mức hoàn theo hạng và dịch vụ; hiển thị thời điểm hiệu lực.'],['Intranet → Quản lý xu → Lịch sử xu','Log cộng/trừ, chờ nhận, thanh toán, đổi quà, hoàn, thu hồi và hết hạn; liên kết đúng đơn/khách.'],['Intranet → Quản lý khách hàng','Hiển thị số dư có thể âm, xu chờ, xu sắp hết hạn, hạng/điểm và lịch sử của riêng khách.'],['Intranet → Quản lý đặt phòng / vé máy bay','Thông tin xu trên đơn và tiến trình nhận/dùng/hoàn; bay theo từng chặng.'],['Intranet → Danh sách đổi quà → Chi tiết','Giữ thiết kế hiện tại; bổ sung số xu còn lại theo yêu cầu.'],['Intranet → Chi tiết đợt tiếp thị','Khung thưởng thêm xu dùng chung loại dịch vụ/phạm vi của đợt; không tạo chương trình ở menu riêng.'],['Khách hàng → Tìm / đặt / thanh toán / lịch sử đặt','Xu dự kiến, số xu được dùng, xu đã dùng/nhận/hoàn gắn với đơn.'],['Khách hàng → Lịch sử xu','Giữ bố cục Bookese; số dư, xu chờ, hết hạn, giao dịch và hạn dùng.'],['Khách hàng → Đổi quà / Quà của tôi','Đổi bằng xu, nhận quà/mã và tra cứu quà đã nhận.'],['Khách hàng → Thưởng hoàn xu','Quyền lợi, hạng hiện tại, điểm và tiến độ lên/giữ hạng.']
  ])) + card('Lộ trình đề xuất L0–L5', table(['Mốc','Trọng tâm','Điều kiện chuyển bước'],[
    ['L0 — chuẩn bị và nền khách lẻ','Sổ giao dịch xu, hạng, chính sách, thanh toán, hoàn, thể lệ và kế toán.','Đối soát được xu–đơn–khách; kiểm thử hủy/hoàn/ghi trùng; duyệt thể lệ và cách hạch toán.'],['L1 — T+1–3 tháng','Referral, đánh giá và CRM chăm sóc.','Chống tự giới thiệu, thưởng trùng và theo dõi khách quay lại.'],['L2 — T+3–6 tháng','Mở rộng giá thành viên, đổi quà và chiến dịch.','Pilot chỗ nghỉ đồng ý ít nhất 20%; nếu không đạt sau 2 vòng phải tái duyệt phương án.'],['L3 — T+6–9 tháng','Đại lý.','Attribution, hợp đồng, thuế, ví thù lao, hoàn và đối soát đã nghiệm thu.'],['L4 — T+9–12 tháng','Đại sứ/KOL.','Kiểm soát tài trợ, nghiệm thu nội dung và hiệu quả đơn.'],['L5 — T+12–18 tháng','NET B2B2C.','Đánh giá riêng hiệu quả và kiểm soát kênh.']
  ]) + p('T là ngày triển khai được duyệt, không phải lịch cam kết. Gate nghiệm thu quyết định mở tính năng; không tự mở đối tác chỉ vì đã đến tháng dự kiến.'), proposal) + card('Các đầu việc trước khi mở chương trình', list([
    'Sản phẩm/Kỹ thuật: kiểm thử một sự kiện chỉ cộng một lần; lỗi thanh toán/đổi quà không để lại khoản trừ; hoàn nhiều lần không vượt tổng gốc.',
    'Vận hành: quy trình điều chỉnh xu có lý do, người thực hiện và quyền duyệt; hỗ trợ khách tra cứu một mã giao dịch xuyên các màn.',
    'Growth/CRM: nội dung thông báo, danh sách khách đủ điều kiện và chống lạm dụng giới thiệu theo tài khoản/thiết bị/thanh toán.',
    'Finance/Pháp chế: rà soát thể lệ, nghĩa vụ đăng ký/thông báo chương trình, hợp đồng, thuế, chứng từ và kế toán trước khi công bố.',
    'Đối tác: thử nghiệm giá thành viên với 10–20 chỗ nghỉ; đo mức chấp nhận và ảnh hưởng hoa hồng.'
  ]), proposal);
  views.economics = () => card('Giả định để trình duyệt, không phải số vận hành', p('Mô hình đề án dùng kịch bản 12.000 đơn, GMV 36 tỷ và ngân sách marketing 720 triệu đồng/năm. Đây là đầu vào giả định để so sánh phương án, không phải số thực tế hay ngân sách đã được duyệt.') + p('PA-A/PA-B là phương án tham chiếu. PA-C là phương án trình bày chính. Mức dự phòng 2%/3%/4% chỉ được xem xét nếu pilot giá thành viên không đạt sau hai vòng mời và phải duyệt lại P&L; không tự nâng tỷ lệ trên hệ thống.') + table(['Phân bổ dự kiến','Tỷ lệ'],[['Performance','60%'],['Content / SEO','20%'],['PR / cộng đồng','10%'],['Dự phòng','10%']]), proposal) + card('Chỉ số mục tiêu và tín hiệu cần xem lại', table(['Chỉ số','Mục tiêu đề án','Cảnh báo'],[
    ['Chi loyalty / GMV','≤5,5%','>5% trong 2 tháng'],['Biên đóng góp','≥10%','<8,5% trong quý'],['CAC','≤350.000đ','>450.000đ'],['Khách quay lại 12 tháng','≥25%','<18% sau 2 quý'],['Đơn / khách','≥1,8','<1,4'],['Tỷ lệ sử dụng xu khách lẻ','70–85%','>85% hoặc <55%'],['Giá trị đơn bình quân','≥2,5 triệu','<2 triệu'],['GMV từ chỗ nghỉ có giá thành viên','≥20% trong 2 quý','Không đạt → xét lại PA-C'],['Đại lý hoạt động cuối L3','≥30','<20'],['Tỷ trọng GMV đối tác','15–35%','>35% trong 2 tháng'],['Khách tự đặt chuyển sang kênh đối tác','<20%','Tăng chi phí kênh mà không thêm khách'],['Tỷ lệ sử dụng thù lao đối tác','≤95%','Vượt giả định chi phí'],['Khách bay mua thêm lưu trú','≥18%','<12%'],['Xu bay / phí dịch vụ','≤50% mỗi chặng','Bất kỳ giao dịch vượt trần'],['Xu hiển thị so với xu ghi nhận','Khớp 100%','Có chênh lệch cần đối soát'],['Look / book','≤500:1','>800:1']
  ]) + p('Ngưỡng cảnh báo kích hoạt phân tích và tái duyệt; không tự thay quyền lợi đã chốt trên đơn. Thay giả định bằng dữ liệu thật sau ba tháng vận hành.'), proposal) + card('Kiểm soát chi phí và trách nhiệm', list([
    'Theo dõi riêng xu nền, xu chiến dịch, referral, đánh giá, thù lao và tài trợ; phân tích theo dịch vụ, kênh và nguồn cung.',
    'Rà soát xu phát hành, đã dùng, hết hạn, chờ nhận và nghĩa vụ còn lại. Giả định xu không được dùng hết phải được Finance kiểm chứng.',
    'Đề án đề xuất theo dõi chi phí marketing và nghĩa vụ xu, quyết toán khi dùng, xử lý khi hết hạn; cách hạch toán cuối cùng do Finance xác nhận.',
    'Đo ảnh hưởng giá thành viên lên hoa hồng; tổn thất vượt 0,5% GMV cần xem lại. Đánh giá nhóm Thân thiết qua thử nghiệm trong 2 quý.',
    'Nếu chi phí hoặc tỷ lệ khách qua kênh đối tác tăng bất thường: kiểm attribution, gian lận và tác động tăng trưởng trước khi duyệt thay chính sách.',
    'Mọi thay đổi tỷ lệ, hạn mức, tài trợ và thuế cần có chủ sở hữu, ngày hiệu lực và phê duyệt; không hồi tố quyền lợi của đơn đã chốt.'
  ]), proposal);
  views.sources = () => card('Tài liệu đối chiếu và thứ tự áp dụng', table(['Nguồn','Dùng cho phần nào'],[
    ['Các quyết định mới nhất trong trao đổi và RQ đã chốt','Vị trí màn hình; số dư âm; tích hợp thưởng xu vào đợt; giữ thiết kế Bookese và link prototype.'],['Cơ chế tính xu.docx','Công thức, trần, kênh, thời điểm ghi nhận, hạng, hoàn/thu hồi và đặc tả vận hành.'],['Đề án Hạng thành viên & Loyalty (bản đầy đủ).docx','PA-C, mô hình kinh doanh, dự kiến tài trợ, CRM, roadmap, KPI và rủi ro.'],['Tờ trình BLD và mô hình tài chính','Tài liệu hỗ trợ phê duyệt; giả định kinh doanh phải được xác nhận, không tự trở thành cấu hình.']
  ]) + p('Ưu tiên quyết định mới đã chốt, sau đó đặc tả cơ chế; số liệu định hướng trong đề án giữ nhãn “dự kiến”. Nội dung chưa thống nhất không được biến thành quy tắc tự động.')) + card('Các điểm đã làm rõ khi đối chiếu', table(['Nội dung','Cách thể hiện trong bản này'],[
    ['Xu âm','Hiển thị thẳng số dư âm; bỏ khái niệm ô “Xu cần bù trừ”.'],['Bậc đại lý','Dùng 60/120 đơn từ đặc tả, không lấy mốc 130 cũ.'],['Giới thiệu người mới','50.000 xu cho người mời khi đủ điều kiện. Voucher 50.000đ cho người mới trong đề án là chương trình riêng cần cấu hình/duyệt.'],['Xu 2%/3%/4% dự phòng','Giữ như phương án tái duyệt; không thay PA-C 1%/2%/3% hiện tại.'],['Thời gian rollout','Lộ trình tương đối theo ngày launch được duyệt, không mặc định ngày cũ trong tài liệu.'],['Thuế và rút tiền','Chưa mở ở giai đoạn 1. Finance/Pháp chế xác nhận quy trình; không mặc định một thuế suất hoặc coi xu khách là tiền có thể rút.'],['Tham quan','Chưa có đặc tả tích xu; không tự suy diễn từ lưu trú/vé bay.']
  ])) + card('Còn cần quyết định trước khi triển khai phần tương ứng', list([
    'Ngày bắt đầu, ngân sách thực tế và chủ sở hữu từng chiến dịch khởi động.',
    'Thể lệ voucher chào mừng, phạm vi thưởng chiến dịch, hạn xu cụ thể và nội dung công bố.',
    'Kết quả pilot giá thành viên, cập nhật mô hình chi phí bằng số liệu thật.',
    'Phạm vi quyền lợi đại lý bị tạm ngừng khi không đạt điều kiện; hợp đồng/tài trợ Đại sứ cuối cùng.',
    'Quy trình thuế, kế toán, đối soát và nghiệm thu trước khi mở ghi nhận/chi trả đối tác.'
  ]), proposal);

  function selected() {
    const value = new URLSearchParams(location.search).get('coinTab') || 'overview';
    return groups.some(g=>g[1].some(t=>t[0]===value)) ? value : 'overview';
  }
  function decorate(key) {
    const app = document.getElementById('app'), body = document.getElementById('loyaltyBody');
    if (!body) return;
    for (const node of [...app.children]) if (node !== body) node.remove();
    app.insertAdjacentHTML('afterbegin', `<section class="guide-heading"><span class="guide-eyebrow">BOOKESE · BẢN TRÌNH BÀY</span><h1>Đề án xu & hạng thành viên</h1><p>Chính sách, cách tính, triển khai và kiểm soát chi phí.</p><a href="intranet.html#coins">Mở màn Quản lý xu →</a></section><nav class="guide-nav" aria-label="Nội dung đề án">${groups.map(([label,items])=>`<div><strong>${label}</strong><div>${items.map(([k,name])=>`<button type="button" ${k===key?'aria-current="page"':''} onclick="coinGo('${k}')">${name}</button>`).join('')}</div></div>`).join('')}</nav>`);
    if (extras[key]) body.insertAdjacentHTML('beforeend', extras[key]());
    const intro = document.createElement('p');
    intro.className = 'guide-mode';
    intro.textContent = views[key] ? 'Nội dung thuyết trình · Các giả định kinh doanh được ghi riêng trong từng mục.' : 'Chính sách đã chốt · Công cụ và giao dịch bên dưới dùng dữ liệu minh họa ngày 23/09/2026.';
    body.prepend(intro);
    // Match the user's current terminology without altering the ledger engine.
    if (key === 'refund') for (const cell of body.querySelectorAll('td')) if (cell.textContent === 'Ghi số dư nợ; cấn lần ghi có sau, không yêu cầu khách nộp tiền.') cell.textContent = 'Hiển thị số dư âm; xu nhận sau bù vào số âm, không yêu cầu khách nộp tiền.';
  }
  coins = function () {
    const key = selected();
    if (views[key]) document.getElementById('app').innerHTML = `<div id="loyaltyBody">${views[key]()}</div>`;
    else oldCoins();
    decorate(key);
  };
  window.coinGo = function (key) {
    if (views[key]) {
      const url = new URL(location); url.searchParams.set('coinTab', key); url.hash = 'coins';
      history.replaceState(null, '', url); coins();
    } else oldGo(key);
  };
  document.title = 'Bookese · Đề án xu & hạng thành viên';
  if (!location.hash) location.hash = 'coins';
  if (location.hash === '#coins') {
    const key = selected();
    if (views[key]) coins(); else oldGo(key);
  }
})();
