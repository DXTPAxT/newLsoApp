import React, { useState, useEffect } from "react";
import MienBac from "./components/MienBac";
import MienTrung from "./components/MienTrung";
import MienNam from "./components/MienNam";
import { tinhtongtien } from "./utils/tinhTongTien";
import { loadAllXosoResults } from "./utils/loadXosoData"; // đổi path nếu khác
import { tinhKetQuaTrungThuongMotKieu } from "./utils/tinhKetQuaTrungThuong"; // đổi path nếu khác
import "./App.css";

function App() {
  var counter = 0;
  var max = 10000;
  var allResults = [];
  const ketQuaTrungThuongArr = [];
  let tongTienTheoKieu = {
    bao2so: 0,
    bao3so: 0,
    xiuChu: 0,
    dauDuoi: 0,
    da: 0,
  };

  useEffect(() => {
    async function fetchData() {
      allResults = await loadAllXosoResults();
      console.log("Toàn bộ kết quả hôm nay:", allResults);
      // setAllResults(allResults) hoặc xử lý tiếp tùy ứng dụng

      const tien = tinhKetQuaTrungThuongMotKieu("dau", "76", "Thừa Thiên Huế", allResults);
      console.log("Tiền trúng:", tien);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const nhapdontext = document.querySelector(".nhapdontext");
    const tinhtong = document.querySelector(".tinhtong");
    const tongdon = document.querySelector(".tongdon");
    const tile = document.querySelector(".tile");
    const checkButton = document.querySelector(".checkButton");

    tinhtong.addEventListener("click", function () {
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
          const kieuDanhArr = [];
          luotdanh = lines[i];
          const kieuDanhPattern =
            /(bdao|xdao|bao|dax|da\d*x?|da|dau|duoi|dui|dd|x|b)/;
          const match = luotdanh.match(kieuDanhPattern);

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
            const match = madanh.match(/(\d*)keo(\d+)/);
            if (match) {
              const [_, startStr, endStr] = match;

              const start = parseInt(startStr || "0", 10); // mặc định start là 0 nếu không có
              const end = parseInt(endStr, 10);

              const digitLength = Math.max(startStr.length, endStr.length); // để giữ định dạng chuẩn
              const generated = [];
              for (let i = start; i <= end; i++) {
                generated.push(i.toString().padStart(digitLength, "0"));
              }

              madanh = generated.join(".");
            }
          }

          // Tách các kiểu đánh còn lại
          const pattern = /(bdao|xdao|bao|dao|da|dau|duoi|dui|dd|x|b)\d*/g;
          const cacKieuDanh = luotdanhPhanConLai.match(pattern) || [];

          // thông báo treo máy
          if (counter == max) {
            alert("Bị lỗi, hãy thử lại.");
          }
          console.log(cacKieuDanh);
          // console.log(dai);
          tongtien += tinhtongtien(dai, madanh, cacKieuDanh, sodai);
        }
      }
      var tileNhan = tile.value != "" ? tile.value.replace(",", ".") / 100 : 1;
      tongdon.innerHTML = tongtien * tileNhan;



    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kết quả Xổ Số hôm nay</h1>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <MienBac />
        <MienTrung />
        <MienNam />
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
          ></textarea>
        </div>
        <div className="tongbox">
          <div className="tong">Tổng</div>
          <div className="tongdon">0</div>
          <hr></hr>
          <button className="checkButton">Check kết quả</button>
          <div className="danhsachtrungso"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
