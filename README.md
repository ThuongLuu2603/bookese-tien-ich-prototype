# Bookese — Prototype tiện ích khách sạn

Hai prototype HTML độc lập, có sẵn CSS, JavaScript và biểu tượng:

- `Bookese-Tien-ich-Prototype.html`: giao diện khách hàng, gồm ba cách hiển thị Gọn / Liền mạch / Theo nhóm.
- `Bookese-Extranet-Prototype.html`: form khách sạn nhập dữ liệu, gồm Thẻ nhóm / Danh sách / Từng bước.

## Mở và dùng thử

Tải kho về, mở terminal tại thư mục và chạy:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

- Khách hàng: http://127.0.0.1:8765/Bookese-Tien-ich-Prototype.html
- Extranet: http://127.0.0.1:8765/Bookese-Extranet-Prototype.html

Có thể mở trực tiếp từng HTML để xem giao diện. Để hai bản chia sẻ dữ liệu ổn định, hãy mở qua cùng máy chủ HTTP như trên.

## Các chức năng thử nghiệm

- Khai báo tổng số tầng (không tính tầng hầm) và số phòng.
- Chọn, sắp xếp tối đa 8 tiện ích nổi bật.
- Nhập chi tiết tiện ích, nhiều hồ bơi hoặc nhà hàng.
- Khai báo lịch tạm đóng toàn bộ hoặc từng cơ sở, ngày đóng, lý do và thông tin bổ sung.
- Xem trước nội dung khách hàng; thông báo tạm đóng được lọc theo kỳ nghỉ.
- Giữ giờ nhận/trả phòng tiêu chuẩn và hiển thị riêng ưu đãi lưu trú 24 giờ.

Dữ liệu khách sạn, giờ và giá là minh họa. Nút Lưu chỉ ghi vào localStorage của trình duyệt, không cập nhật hệ thống Bookese thật và không đồng bộ giữa các thiết bị. Bản đồ dùng Google Maps cần Internet.
