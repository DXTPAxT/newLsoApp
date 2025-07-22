import React, { useState, useEffect } from "react";
import MienBac from "./components/MienBac";
import MienTrung from "./components/MienTrung";
import MienNam from "./components/MienNam";
import { tinhtongtien } from "./utils/tinhTongTien";
import { loadAllXosoResults } from "./utils/loadXosoData"; // đổi path nếu khác
import { tinhKetQuaTrungThuongMotKieu } from "./utils/tinhKetQuaTrungThuong"; // đổi path nếu khác
import { tachDanhSachTinhThanh } from "./utils/tachDanhSachTinhThanh"; // đổi path nếu khác
import "./App.css";

function App() {
  const [selectedDate, setSelectedDate] = useState("today");
  var counter = 0;
  var max = 10000;
  var allResults = [];
  let tongTienTheoKieuMb = {
    bao2so: 0,
    bao3so: 0,
    xiuChu: 0,
    dauDuoi: 0,
    da: 0,
  };

  let tongTienTheoKieuMnMt = {
    bao2so: 0,
    bao3so: 0,
    xiuChu: 0,
    dauDuoi: 0,
    da: 0,
    daMotDai: 0, // Đá 1 chỉ có ở Miền Nam
  };

  useEffect(() => {
    async function fetchData() {
      allResults = await loadAllXosoResults(selectedDate);
      console.log("Toàn bộ kết quả:", allResults);
      alert("Dữ liệu kết quả xổ số đã được tải!");
      // setAllResults(allResults) hoặc xử lý tiếp tùy ứng dụng

      // const tien = tinhKetQuaTrungThuongMotKieu(
      //   "bao",
      //   "45",
      //   "Hà Nội",
      //   allResults
      // );
      // console.log("Tiền trúng:", tien);
    }

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const nhapdontext = document.querySelector(".nhapdontext");
    const tinhtong = document.querySelector(".tinhtong");
    const tongdon = document.querySelector(".tongdon");
    const tile = document.querySelector(".tile");
    const checkButton = document.querySelector(".checkButton");
    let dongTrungMap = new Map();

    tinhtong.addEventListener("click", function () {
      dongTrungMap = new Map();
      tongTienTheoKieuMb = {
        bao2so: 0,
        bao3so: 0,
        xiuChu: 0,
        dauDuoi: 0,
        da: 0,
      };

      tongTienTheoKieuMnMt = {
        bao2so: 0,
        bao3so: 0,
        xiuChu: 0,
        dauDuoi: 0,
        da: 0,
        daMotDai: 0, // Đá 1 chỉ có ở Miền Nam
      };
      counter = 0;
      const lines = nhapdontext.value.split("\n");
      const madais = [
        "Tpho",
        "Dthap",
        "Cmau",
        "Btre",
        "Vtau",
        "Blieu",
        "Dnai",
        "Ctho",
        "Strang",
        "Tninh",
        "Agiang",
        "Bthuan",
        "Vlong",
        "Bduong",
        "Tvinh",
        "Lan",
        "Bphuoc",
        "Hgiang",
        "Tgiang",
        "Kgiang",
        "Dlat",
        "Pyen",
        "Hue",
        "Dlak",
        "Qnam",
        "Dnang",
        "Khoa",
        "Bdinh",
        "Qtri",
        "Qbinh",
        "Glai",
        "Nthuan",
        "Qngai",
        "Dnong",
        "Ktum",
        "hn",
      ];
      const tendais = [
        "TP. HCM",
        "Đồng Tháp",
        "Cà Mau",
        "Bến Tre",
        "Vũng Tàu",
        "Bạc Liêu",
        "Đồng Nai",
        "Cần Thơ",
        "Sóc Trăng",
        "Tây Ninh",
        "An Giang",
        "Bình Thuận",
        "Vĩnh Long",
        "Bình Dương",
        "Trà Vinh",
        "Long An",
        "Bình Phước",
        "Hậu Giang",
        "Tiền Giang",
        "Kiên Giang",
        "Đà Lạt",
        "Phú Yên",
        "Thừa Thiên Huế",
        "Đắk Lắk",
        "Quảng Nam",
        "Đà Nẵng",
        "Khánh Hòa",
        "Bình Định",
        "Quảng Trị",
        "Quảng Bình",
        "Gia Lai",
        "Ninh Thuận",
        "Quảng Ngãi",
        "Đắk Nông",
        "Kon Tum",
        "Hà Nội",
      ];
      var sodai = 0;
      var dai = "";
      var luotdanh;
      var tongtien = 0;

      for (var i = 0; i < lines.length; i++) {
        // gắn đài
        if (i == 0 || (sodai == 0 && lines[i] != "")) {
          dai = lines[i];
          if (!isNaN(dai[0])) {
            sodai = dai[0];
          } else if (dai.toLowerCase() == "hn") {
            dai = "hn";
            sodai = 1;
          } else if (dai.toLowerCase() != "hn") {
            dai = dai.toLowerCase();
            madais.forEach((madai) => {
              if (dai.includes(madai.toLowerCase())) {
                sodai++;
                dai = dai.replace(madai.toLowerCase(), "");
              }
            });
            madais.forEach((madai) => {
              if (dai.includes(madai.toLowerCase())) {
                sodai++;
                dai = dai.replace(madai.toLowerCase(), "");
              }
            });
            dai = lines[i].toLowerCase();
          }
          // hàng trống
        } else if (sodai != 0 && lines[i] == "") {
          sodai = 0;
          // cộng từng lượt đánh
        } else if (sodai != 0 && lines[i] != "") {
          luotdanh = lines[i];

          const pattern = /(da\d+(?:,\d+)?x)|(bdao|xdao|bao|duoi|dui|dau|dd|da|b|x)\d+(?:,\d+)?/gi;
          const match = luotdanh.match(pattern);

          let madanh = "";
          let luotdanhPhanConLai = "";

          if (match) {
            const index = luotdanh.indexOf(match[0]);
            madanh = luotdanh.substring(0, index);
            luotdanhPhanConLai = luotdanh.substring(index);
          } else {
            madanh = luotdanh;
          }

          // Xử lý trường hợp "keo" với start–end bất kỳ
          if (madanh.includes("keo")) {
            madanh = expandKeo(madanh);
          }

          // Tách các kiểu đánh còn lại (lại dùng regex mới)
          const cacKieuDanh = luotdanhPhanConLai.match(pattern) || [];

          // thông báo treo máy
          if (counter == max) {
            alert("Bị lỗi, hãy thử lại.");
          }

          // console.log(cacKieuDanh);
          // console.log(dai);
          // console.log(madanh);
          tongtien += tinhtongtien(dai, madanh, cacKieuDanh, sodai);
          // console.log(tinhtongtien(dai, madanh, cacKieuDanh, sodai));
          // console.log(tongtien);
          // console.log(`==============`);

          // tính kết quả trúng thưởng
          var dodaimadanh = madanh.split(".")[0].length;
          for (var kieudanh of cacKieuDanh) {
            var matchHeSo = kieudanh.match(/\d+([.,]\d+)?/);
            var heso = matchHeSo
              ? parseFloat(matchHeSo[0].replace(",", "."))
              : 1;
            var danhsachdai = tachDanhSachTinhThanh(
              dai,
              madais,
              tendais,
              selectedDate
            );
            var ketqua;

            // console.log("");
            // console.log(danhsachdai);
            // console.log(madanh);
            // console.log(kieudanh);
            // console.log(heso);

            if (kieudanh.startsWith("b")) {
              if (dodaimadanh === 2) {
                ketqua = tinhKetQuaTrungThuongMotKieu(
                  "bao",
                  madanh,
                  danhsachdai,
                  allResults
                );
                if (ketqua.mien === "Miền Bắc") {
                  tongTienTheoKieuMb.bao2so +=
                    parseFloat(ketqua.tong) * heso || 0;
                } else if (
                  ketqua.mien === "Miền Nam" ||
                  ketqua.mien === "Miền Trung"
                ) {
                  tongTienTheoKieuMnMt.bao2so +=
                    parseFloat(ketqua.tong) * heso || 0;
                }
              } else if (dodaimadanh === 3) {
                ketqua = tinhKetQuaTrungThuongMotKieu(
                  "bao",
                  madanh,
                  danhsachdai,
                  allResults
                );
                if (ketqua.mien === "Miền Bắc") {
                  tongTienTheoKieuMb.bao3so +=
                    parseFloat(ketqua.tong) * heso || 0;
                } else if (
                  ketqua.mien === "Miền Nam" ||
                  ketqua.mien === "Miền Trung"
                ) {
                  tongTienTheoKieuMnMt.bao3so +=
                    parseFloat(ketqua.tong) * heso || 0;
                }
              }
            } else if (
              kieudanh.startsWith("x") &&
              !kieudanh.startsWith("xdao")
            ) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                "x",
                madanh,
                danhsachdai,
                allResults
              );
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.xiuChu +=
                  parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                tongTienTheoKieuMnMt.xiuChu +=
                  parseFloat(ketqua.tong) * heso || 0;
              }
            } else if (kieudanh.startsWith("dd")) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                kieudanh,
                madanh,
                danhsachdai,
                allResults
              );
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                tongTienTheoKieuMnMt.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
                // console.log(tongTienTheoKieuMnMt.dauDuoi);
              }
            } else if (kieudanh.startsWith("dau")) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                kieudanh,
                madanh,
                danhsachdai,
                allResults
              );
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                tongTienTheoKieuMnMt.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
              }
            } else if (
              kieudanh.startsWith("duoi") ||
              kieudanh.startsWith("dui")
            ) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                kieudanh,
                madanh,
                danhsachdai,
                allResults
              );
              // console.log(ketqua);
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                tongTienTheoKieuMnMt.dauDuoi +=
                  parseFloat(ketqua.tong) * heso || 0;
              }
            } else if (kieudanh.startsWith("da") && danhsachdai.length != 1) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                "da" + dodaimadanh / 2,
                madanh,
                danhsachdai,
                allResults
              );
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.da += parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                // console.log(danhsachdai.length);
                tongTienTheoKieuMnMt.da += parseFloat(ketqua.tong) * heso || 0;
              }
            } else if (kieudanh.startsWith("da") && danhsachdai.length === 1) {
              ketqua = tinhKetQuaTrungThuongMotKieu(
                "da" + dodaimadanh / 2,
                madanh,
                danhsachdai,
                allResults
              );
              if (ketqua.mien === "Miền Bắc") {
                tongTienTheoKieuMb.da += parseFloat(ketqua.tong) * heso || 0;
              } else if (
                ketqua.mien === "Miền Nam" ||
                ketqua.mien === "Miền Trung"
              ) {
                // console.log(danhsachdai.length);
                if (danhsachdai.length === 1) {
                  tongTienTheoKieuMnMt.daMotDai +=
                    parseFloat(ketqua.tong) * heso || 0;
                }
              }
            }
            // console.log(ketqua);
            // console.log(tongTienTheoKieuMnMt.daMotDai);
            if (
              !kieudanh.startsWith("b") ||
              (kieudanh.startsWith("b") && dodaimadanh != 4)
            ) {
              if (parseFloat(ketqua.tong) > 0) {
                // ketqua.danhsachTrung giả sử là mảng số trúng
                if (dongTrungMap.has(i)) {
                  dongTrungMap.get(i).push(...(ketqua.soTrung || []));
                } else {
                  dongTrungMap.set(i, [...(ketqua.soTrung || [])]);
                }
              }
            }
          }
        }
      }

      var tileNhan = tile.value != "" ? tile.value.replace(",", ".") / 100 : 1;
      tongdon.innerHTML = tongtien * tileNhan;
    });

    checkButton.addEventListener("click", function () {
      const container = document.querySelector(".danhsachtrungso");
      const formatTien = (v) => Number(v || 0).toLocaleString("vi-VN");

      const bao2Input = Number(document.querySelector(".bao2Input").value) || 0;
      const bao3Input = Number(document.querySelector(".bao3Input").value) || 0;
      const xiuchuInput =
        Number(document.querySelector(".xiuchuInput").value) || 0;
      const ddInput = Number(document.querySelector(".ddInput").value) || 0;
      const daInputBac =
        Number(document.querySelector(".daInputBac").value) || 0;
      const daInputTrung =
        Number(document.querySelector(".daInputTrung").value) || 0;
      const daMotDai = Number(document.querySelector(".daMotDai").value) || 0;

      const html = `
    <table class="bang-ket-qua">
      <thead>
        <tr>
          <th>Kiểu</th>
          <th>Miền Bắc</th>
          <th>Miền Nam / Trung</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Bao 2 số</td>
          <td>${formatTien((tongTienTheoKieuMb.bao2so * bao2Input) / 76)}</td>
          <td>${formatTien((tongTienTheoKieuMnMt.bao2so * bao2Input) / 76)}</td>
        </tr>
        <tr>
          <td>Bao 3 số</td>
          <td>${formatTien((tongTienTheoKieuMb.bao3so * bao3Input) / 660)}</td>
          <td>${formatTien(
            (tongTienTheoKieuMnMt.bao3so * bao3Input) / 660
          )}</td>
        </tr>
        <tr>
          <td>Xỉu Chủ</td>
          <td>${formatTien(
            (tongTienTheoKieuMb.xiuChu * xiuchuInput) / 660
          )}</td>
          <td>${formatTien(
            (tongTienTheoKieuMnMt.xiuChu * xiuchuInput) / 660
          )}</td>
        </tr>
        <tr>
          <td>Đầu / Đuôi</td>
          <td>${formatTien((tongTienTheoKieuMb.dauDuoi * ddInput) / 76)}</td>
          <td>${formatTien((tongTienTheoKieuMnMt.dauDuoi * ddInput) / 76)}</td>
        </tr>
        <tr>
          <td>Đá</td>
          <td>${formatTien((tongTienTheoKieuMb.da * daInputBac) / 660)}</td>
          <td>${formatTien((tongTienTheoKieuMnMt.da * daInputTrung) / 560)}</td>
        </tr>
        <tr>
          <td>Đá 1</td>
          <td></td>
          <td>${formatTien(
            (tongTienTheoKieuMnMt.daMotDai * daMotDai) / 750
          )}</td>
        </tr>
        <tr>
          <td>Tổng</td>
          <td>${formatTien(
            (tongTienTheoKieuMb.bao2so * bao2Input) / 76 +
              (tongTienTheoKieuMb.bao3so * bao3Input) / 660 +
              (tongTienTheoKieuMb.xiuChu * xiuchuInput) / 660 +
              (tongTienTheoKieuMb.dauDuoi * ddInput) / 76 +
              (tongTienTheoKieuMb.da * daInputBac) / 660
          )}</td>
          <td>${formatTien(
            (tongTienTheoKieuMnMt.bao2so * bao2Input) / 76 +
              (tongTienTheoKieuMnMt.bao3so * bao3Input) / 660 +
              (tongTienTheoKieuMnMt.xiuChu * xiuchuInput) / 660 +
              (tongTienTheoKieuMnMt.dauDuoi * ddInput) / 76 +
              (tongTienTheoKieuMnMt.da * daInputTrung) / 560 +
              (tongTienTheoKieuMnMt.daMotDai * daMotDai) / 750
          )}</td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2">${formatTien(
            (tongTienTheoKieuMb.bao2so * bao2Input) / 76 +
              (tongTienTheoKieuMb.bao3so * bao3Input) / 660 +
              (tongTienTheoKieuMb.xiuChu * xiuchuInput) / 660 +
              (tongTienTheoKieuMb.dauDuoi * ddInput) / 76 +
              (tongTienTheoKieuMb.da * daInputBac) / 660 +
              (tongTienTheoKieuMnMt.bao2so * bao2Input) / 76 +
              (tongTienTheoKieuMnMt.bao3so * bao3Input) / 660 +
              (tongTienTheoKieuMnMt.xiuChu * xiuchuInput) / 660 +
              (tongTienTheoKieuMnMt.dauDuoi * ddInput) / 76 +
              (tongTienTheoKieuMnMt.da * daInputTrung) / 560 +
              (tongTienTheoKieuMnMt.daMotDai * daMotDai) / 750
          )}</td>
        </tr>
      </tbody>
    </table>
  `;

      container.innerHTML = html;
      const ketquaView = document.querySelector(".ketquaView");
      const rawInput = nhapdontext.value.split("\n");

      const newHtml = rawInput
        .map((line, index) => {
          if (dongTrungMap.has(index)) {
            const trung = dongTrungMap.get(index).join(", ");
            return `<span style="color:red">${line}</span> <span style="color:blue">→ Trúng: ${trung}</span>`;
          } else {
            return line;
          }
        })
        .join("<br>");

      // Hiển thị dòng tô đỏ
      ketquaView.innerHTML = `<h3>Chi tiết đơn đã đánh (đỏ là trúng)</h3><pre>${newHtml}</pre>`;
    });
  }, [selectedDate]);

  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  function expandKeo(madanh) {
    const match = madanh.match(/(\d+)keo(\d+)/i);
    if (!match) return madanh;

    const [_, startStr, endStr] = match;
    const digitLength = Math.max(startStr.length, endStr.length);

    // Nếu giống chữ số đầu → kéo theo hàng nhỏ hơn
    if (startStr[0] === endStr[0]) {
      // tìm phần khác nhau
      let splitIndex = 0;
      while (
        splitIndex < startStr.length &&
        splitIndex < endStr.length &&
        startStr[splitIndex] === endStr[splitIndex]
      ) {
        splitIndex++;
      }

      const prefix = startStr.slice(0, splitIndex);
      const from = parseInt(startStr.slice(splitIndex), 10);
      const to = parseInt(endStr.slice(splitIndex), 10);
      const suffixLength = startStr.length - splitIndex;

      const results = [];
      for (let i = from; i <= to; i++) {
        const suffix = i.toString().padStart(suffixLength, "0");
        results.push(prefix + suffix);
      }
      return results.join(".");
    }

    // nếu khác hoàn toàn → chỉ kéo hàng trăm
    if (digitLength === 3) {
      const from = parseInt(startStr, 10);
      const to = parseInt(endStr, 10);

      const results = [];
      for (let i = from; i <= to; i += 100) {
        results.push(i.toString().padStart(digitLength, "0"));
      }
      return results.join(".");
    }

    // trường hợp còn lại cứ kéo bình thường
    const from = parseInt(startStr, 10);
    const to = parseInt(endStr, 10);
    const results = [];
    for (let i = from; i <= to; i++) {
      results.push(i.toString().padStart(digitLength, "0"));
    }
    return results.join(".");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        Kết quả Xổ Số ngày {selectedDate == "today" ? "hôm nay" : "hôm qua"}
      </h1>

      {/* Thẻ select chọn ngày */}
      <div style={{ marginBottom: "20px", fontSize: "24px" }}>
        <label htmlFor="dateSelect">Chọn ngày: </label>
        <select
          id="dateSelect"
          value={selectedDate}
          onChange={handleChange}
          style={{ fontSize: "24px" }}
        >
          <option value="today" style={{ fontSize: "24px" }}>
            Hôm nay
          </option>
          <option value="yesterday" style={{ fontSize: "24px" }}>
            Hôm qua
          </option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div>
          <MienBac selectedDate={selectedDate} />
          <h3 style={{ fontSize: "24px" }}>
            Kết quả trúng thưởng{" "}
            {selectedDate == "today" ? "hôm nay" : "hôm qua"}
          </h3>
          <div
            style={{
              maxWidth: "600px",
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div
              className="ketquaView"
              style={{ margin: "20px 0", fontSize: "16px" }}
            ></div>
          </div>
        </div>
        <MienTrung selectedDate={selectedDate} />
        <MienNam selectedDate={selectedDate} />
      </div>

      <div className="nhapdonGroup">
        <div className="nhapdonbox">
          <div className="nhapdonboxheader">
            <div className="nhapdon">Nhập đơn</div>
            <div className="tiletinhtong">
              <input className="tile" placeholder="Nhập tỉ lệ %..." />
              <div className="tinhtong">Tính tổng</div>
            </div>
          </div>
          <textarea
            className="nhapdontext"
            placeholder="Nhập đơn ở đây..."
            style={{ fontSize: "20px" }}
          ></textarea>
        </div>
        <div className="tongbox">
          <div className="tong">Tổng</div>
          <div className="tongdon">0</div>
          <hr></hr>
          <div className="main-row">
            {/* Bọc 2 phần dưới vào 1 div */}
            <div className="action-row">
              <button className="checkButton">Check kết quả</button>
              <div className="danhsachtrungso">...</div>
            </div>
            <div className="form-container">
              <label>
                Bao 2 số
                <input
                  className="bao2Input"
                  type="text"
                  placeholder="Bao 2 số"
                  defaultValue="76"
                />
              </label>

              <label>
                Bao 3 số
                <input
                  className="bao3Input"
                  type="text"
                  placeholder="Bao 3 số"
                  defaultValue="660"
                />
              </label>

              <label>
                Xỉu chủ
                <input
                  className="xiuchuInput"
                  type="text"
                  placeholder="Xỉu chủ"
                  defaultValue="660"
                />
              </label>

              <label>
                Đầu Đuôi
                <input
                  className="ddInput"
                  type="text"
                  placeholder="Đầu Đuôi"
                  defaultValue="76"
                />
              </label>

              <div className="daGroup">
                <label>
                  Đá Bắc
                  <input
                    className="daInputBac"
                    type="text"
                    placeholder="Đá Bắc"
                    defaultValue="660"
                  />
                </label>
                <div>
                  <label>
                    Đá Trung Nam
                    <input
                      className="daInputTrung"
                      type="text"
                      placeholder="Đá Trung Nam"
                      defaultValue="560"
                    />
                  </label>
                  <label>
                    Đá 1
                    <input
                      className="daMotDai"
                      type="text"
                      placeholder="Đá Trung Nam"
                      defaultValue="750"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
