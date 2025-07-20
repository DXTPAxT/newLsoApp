import React, { useState, useEffect } from "react";
import MienBac from "./components/MienBac";
import MienTrung from "./components/MienTrung";
import MienNam from "./components/MienNam";
import { tinhtongtien } from "./utils/tinhTongTien";
import "./App.css";

function App() {
  var counter = 0;
  var max = 10000;
  useEffect(() => {
    const substrings = [
      "bdao",
      "xdao",
      "b",
      "dau",
      "duoi",
      "da",
      "dd",
      "x",
      "dui",
    ];
    const nhapdontext = document.querySelector(".nhapdontext");
    const tinhtong = document.querySelector(".tinhtong");
    const tongdon = document.querySelector(".tongdon");
    const ketquasosoList = document.querySelectorAll(".textarea1");
    const checkList = document.querySelectorAll(".checkkq");
    const danhsachtrungsoList = document.querySelectorAll(".danhsachtrungso");
    const tile = document.querySelector(".tile");

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
          var luotdanhArr = luotdanh.split(
            new RegExp(substrings.join("|"), "g")
          );
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
          const pattern = /(bdao|xdao|bao|da|dau|duoi|dui|dd|x|b)\d*(x)?/g;
          const cacKieuDanh = luotdanhPhanConLai.match(pattern) || [];

          //        thông báo treo máy
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

    checkList.forEach((check, index) => {
      check.addEventListener("click", function () {
        counter = 0;
        const ketQua = ketquasosoList[index].value;
        const ketQuaArr = ketQua.split("\n");
        const dai = ketQuaArr[0].toLowerCase();
        const donArr = nhapdontext.value.split("\n");
        danhsachtrungsoList[index].innerHTML = "";
        nhapdontext.innerHTML = "";
        let trungSoMap = [];
        let danhtrungsomap = [];

        for (var i = 0; i < donArr.length; i++) {
          if (donArr[i].toLowerCase().includes(dai)) {
            i++;
            while (donArr[i] != "" && i < donArr.length && counter < max) {
              counter++;
              // console.log(counter);
              let maDanh = [];
              if (!donArr[i].includes("da")) {
                const donArrSplit = donArr[i].split(
                  new RegExp(substrings.join("|"), "g")
                );
                maDanh = donArrSplit[0].split(".");
              } else {
                const donArrSplit = donArr[i].split(
                  new RegExp(substrings.join("|"), "g")
                );
                for (let i = 0; i < donArrSplit[0].length; i += 2) {
                  maDanh.push(donArrSplit[0].slice(i, i + 2));
                }
              }

              for (var j = 0; j < maDanh.length; j++) {
                const sokitu = maDanh[j].length;
                for (var k = 0; k < ketQuaArr.length; k++) {
                  if (!isNaN(ketQuaArr[k]) && ketQuaArr[k].length >= sokitu) {
                    if (ketQuaArr[k].slice(-sokitu) == maDanh[j]) {
                      trungSoMap.push(ketQuaArr[k]);
                      danhtrungsomap.push(maDanh[j]);
                    }
                  }
                }
              }
              i++;
            }
            //          thông báo treo máy
            if (counter == max) {
              alert("Bị lỗi, hãy thử lại.");
            }
          }
        }
      });
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
          <button>Check kết quả</button>
          <div className="danhsachtrungso"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
