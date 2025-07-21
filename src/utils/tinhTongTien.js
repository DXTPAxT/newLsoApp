// src/utils/tinhTongTien.js

function checkTwoPairs(str) {
  let countMap = new Map();
  for (let char of str) {
    countMap.set(char, (countMap.get(char) || 0) + 1);
  }
  let counts = Array.from(countMap.values());
  return counts.length === 2 && counts.every((count) => count === 2);
}

function da(dai, luotdanhArr, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var hesoma = 0;
  var madanh = luotdanhArr[0].split(".");
  var tongtien = 0;
  if (sodai != 3) {
    console.log(madanh[i]);
    for (var i = 0; i < madanh.length; i++) {
      if (madanh[i] === "") continue;
      if (madanh[i].length === 4) hesoma = dai === "hn" ? 54 : 36;
      else if (madanh[i].length === 6) hesoma = dai === "hn" ? 54 * 3 : 36 * 3;
      else if (madanh[i].length === 8) hesoma = dai === "hn" ? 54 * 6 : 36 * 6;
      else if (madanh[i].length === 10)
        hesoma = dai === "hn" ? 54 * 10 : 36 * 10;
      else if (madanh[i].length === 12)
        hesoma = dai === "hn" ? 54 * 15 : 36 * 15;
      tongtien += hesoma;
    }
    return sodai * tongtien * hesodanh;
  } else {
    for (var i = 0; i < madanh.length; i++) {
      if (madanh[i] === "") continue;
      if (madanh[i].length === 4) hesoma = 216;
      else if (madanh[i].length === 6) hesoma = 216 * 3;
      else if (madanh[i].length === 8) hesoma = 216 * 6;
      else if (madanh[i].length === 10) hesoma = 216 * 10;
      tongtien += hesoma;
    }
    return parseFloat((tongtien * hesodanh).toFixed(12));
  }
}

function dax(dai, luotdanhArr, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var hesoma = 0;
  var madanh = luotdanhArr[0].split(".");
  var tongtien = 0;
  for (var i = 0; i < madanh.length; i++) {
    if (madanh[i] === "") continue;
    if (madanh[i].length === 4) hesoma = dai === "hn" ? 67.5 : 45;
    else if (madanh[i].length === 6) hesoma = dai === "hn" ? 67.5 * 3 : 45 * 3;
    else if (madanh[i].length === 8) hesoma = dai === "hn" ? 67.5 * 6 : 45 * 6;
    else if (madanh[i].length === 10)
      hesoma = dai === "hn" ? 67.5 * 10 : 45 * 10;
    tongtien += hesoma;
  }
  return sodai * tongtien * hesodanh;
}

function bao(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var hesoma = 0;
  var madanh = luotdanhArr[0].split(".");
  var tongtien = 0;
  for (var i = 0; i < madanh.length; i++) {
    if (madanh[i] === "") continue;
    var sokitu = madanh[i].length;
    if (sokitu === 2) hesoma = dai === "hn" ? 27 : 18;
    else if (sokitu === 3) hesoma = dai === "hn" ? 23 : 17;
    else if (sokitu === 4) hesoma = dai === "hn" ? 20 : 16;
    tongtien += hesoma;
  }
  return sodai * tongtien * hesodanh;
}

function baodao(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var hesoma = 0;
  var madanh = luotdanhArr[0].split(".");
  var tongtien = 0;
  for (var i = 0; i < madanh.length; i++) {
    if (madanh[i] === "") continue;
    var sokitu = madanh[i].length;
    if (sokitu === 3) {
      hesoma =
        new Set(madanh[i]).size === 3
          ? dai === "hn"
            ? 23 * 6
            : 17 * 6
          : dai === "hn"
          ? 23 * 3
          : 17 * 3;
    } else if (sokitu === 4) {
      if (new Set(madanh[i]).size === 4)
        hesoma = dai === "hn" ? 20 * 24 : 16 * 24;
      else if (new Set(madanh[i]).size === 3)
        hesoma = dai === "hn" ? 20 * 12 : 16 * 12;
      else if (checkTwoPairs(madanh[i]))
        hesoma = dai === "hn" ? 20 * 6 : 16 * 6;
      else hesoma = dai === "hn" ? 20 * 4 : 16 * 4;
    }
    tongtien += hesoma;
  }
  return sodai * tongtien * hesodanh;
}

function xc(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var hesoma = dai === "hn" ? 4 : 2;
  var madanh = luotdanhArr[0].split(".");
  return sodai * madanh.length * hesoma * hesodanh;
}

function xcdao(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var madanh = luotdanhArr[0].split(".");
  var tongtien = 0;
  for (let so of madanh) {
    if (so === "") continue;
    let hesoma =
      new Set(so).size === 3
        ? dai === "hn"
          ? 4 * 6
          : 2 * 6
        : dai === "hn"
        ? 4 * 3
        : 2 * 3;
    tongtien += hesoma;
  }
  return sodai * tongtien * hesodanh;
}

function dd(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var madanh = luotdanhArr[0].split(".");
  var hesoma = dai === "hn" ? 5 : 2;
  return sodai * madanh.length * hesoma * hesodanh;
}

function dau(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var madanh = luotdanhArr[0].split(".");
  var hesoma = dai === "hn" ? 4 : 1;
  return sodai * madanh.length * hesoma * hesodanh;
}

function duoi(luotdanhArr, dai, sodai) {
  var hesodanh = luotdanhArr[1].replace(",", ".");
  var madanh = luotdanhArr[0].split(".");
  var hesoma = 1;
  return sodai * madanh.length * hesoma * hesodanh;
}

// Hàm chính export ra dùng trong App.js
export function tinhtongtien(dai, maDanh, cacKieuDanh, sodai) {
  let tongtien = 0;
  let danhSachSo = maDanh.includes(".") ? maDanh.split(".") : [maDanh];

  cacKieuDanh.forEach((kieudanh) => {
    const soTienStr = kieudanh.replace(/[a-zA-Z]/g, "") + "";
    danhSachSo.forEach((so) => {
      const luotdanhArr = [so, soTienStr];

      if (/^da\d*x$/.test(kieudanh)) {
        tongtien += dax(dai, luotdanhArr, sodai);
      } else if (
        kieudanh.includes("da") &&
        !kieudanh.includes("x") &&
        !kieudanh.includes("dao") &&
        !kieudanh.includes("dau")
      ) {
        tongtien += da(dai, luotdanhArr, sodai);
      } else if (kieudanh.includes("b")) {
        tongtien += kieudanh.includes("dao")
          ? baodao(luotdanhArr, dai, sodai)
          : bao(luotdanhArr, dai, sodai);
      } else if (kieudanh.includes("x")) {
        tongtien += kieudanh.includes("dao")
          ? xcdao(luotdanhArr, dai, sodai)
          : xc(luotdanhArr, dai, sodai);
      } else if (kieudanh.includes("dd")) {
        tongtien += dd(luotdanhArr, dai, sodai);
      } else if (kieudanh.includes("dau")) {
        tongtien += dau(luotdanhArr, dai, sodai);
      } else if (kieudanh.includes("duoi") || kieudanh.includes("dui")) {
        tongtien += duoi(luotdanhArr, dai, sodai);
      }
    });
  });

  return tongtien;
}
