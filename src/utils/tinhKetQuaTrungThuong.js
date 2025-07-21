export function tinhKetQuaTrungThuongMotKieu(
  kieuDanh,
  maDanh,
  provinceList,
  allResults
) {
  const bacTowns = [
    { code: "miba", name: "Miền Bắc" },
    { code: "hanoo", name: "Hà Nội" },
  ];
  const trungTowns = [
    { code: "phye", name: "Phú Yên" },
    { code: "thth", name: "Thừa Thiên Huế" },
    { code: "dalak", name: "Đắk Lắk" },
    { code: "quna", name: "Quảng Nam" },
    { code: "bidi", name: "Bình Định" },
    { code: "qutr", name: "Quảng Trị" },
    { code: "gila", name: "Gia Lai" },
    { code: "nith", name: "Ninh Thuận" },
    { code: "kotu", name: "Kon Tum" },
    { code: "dana", name: "Đà Nẵng" },
    { code: "qung", name: "Quảng Ngãi" },
    { code: "khho", name: "Khánh Hòa" },
    { code: "qubi", name: "Quảng Bình" },
    { code: "dano", name: "Đắk Nông" },
  ];
  const namTowns = [
    { code: "tphc", name: "TP. HCM" },
    { code: "doth", name: "Đồng Tháp" },
    { code: "betr", name: "Bến Tre" },
    { code: "vuta", name: "Vũng Tàu" },
    { code: "dona", name: "Đồng Nai" },
    { code: "cath", name: "Cần Thơ" },
    { code: "tani", name: "Tây Ninh" },
    { code: "angi", name: "An Giang" },
    { code: "vilo", name: "Vĩnh Long" },
    { code: "bidu", name: "Bình Dương" },
    { code: "loan", name: "Long An" },
    { code: "tigi", name: "Tiền Giang" },
    { code: "kigi", name: "Kiên Giang" },
    { code: "bali", name: "Bạc Liêu" },
    { code: "biph", name: "Bình Phước" },
    { code: "cama", name: "Cà Mau" },
    { code: "hagi", name: "Hậu Giang" },
    { code: "sotr", name: "Sóc Trăng" },
    { code: "trvi", name: "Trà Vinh" },
    { code: "bith", name: "Bình Thuận" },
    { code: "dalat", name: "Đà Lạt" },
  ];

  let tong = 0;
  let mien = "Không xác định";
  const tatCaSo = [];
  const giaiDB = [];
  const giai6 = [];
  const giai7 = [];
  const giai8 = [];
  const provinces = Array.isArray(provinceList) ? provinceList : [provinceList];

  console.log(provinces);
  // console.log(allResults);

  for (const provinceName of provinces) {
    const realProvinceName =
      provinceName == "Hà Nội" ? "Miền Bắc" : provinceName;

    const ketquaDai = allResults.find(
      (res) =>
        res.province.toLowerCase().trim() ===
        realProvinceName.toLowerCase().trim()
    );

    // console.log(ketquaDai);

    if (!ketquaDai) continue;

    let detailStr = ketquaDai.data["detail"] || "";

    try {
      const giaiArr = JSON.parse(detailStr); // mảng chuỗi các giải

      giaiArr.forEach((giai, idx) => {
        if (typeof giai === "string") {
          // Gom tất cả các số
          if (giai.includes(",")) {
            const giaiN = giai.split(",").map((x) => x.trim());
            tatCaSo.push(...giaiN);

            // Gom riêng giải 6 và 7
            if (idx === 6) giai6.push(...giaiN); // g6
            if (idx === 7) giai7.push(...giaiN); // g7
          } else {
            tatCaSo.push(giai);
            if (idx === 8) giai8.push(giai); // g8
            if (idx === 7) giai7.push(giai); // g7
            if (idx === 0) giaiDB.push(giai); // g0
          }
        }
      });
    } catch (e) {
      console.error("Lỗi parse detail JSON:", e);
    }
  }

  // console.log("Toàn bộ số:", tatCaSo);

  const soDanhArr = maDanh.split(".");
  const isBac = mien === "Miền Bắc";

  if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 2) {
    for (const so of soDanhArr) {
      if (tatCaSo.some((trung) => trung.endsWith(so))) tong += 76;
    }
  } else if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 3) {
    for (const so of soDanhArr) {
      if (tatCaSo.some((trung) => trung.endsWith(so))) tong += 660;
    }
  } else if (kieuDanh.startsWith("dau")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giai7] : [...giai8];
      if (giaiCheck.some((g) => (g + "").startsWith(so))) {
        tong += 76;
      }
    }
  } else if (kieuDanh.startsWith("duoi") || kieuDanh.startsWith("dui")) {
    console.log(`Tính giải Đuôi với số:`, soDanhArr);
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giaiDB] : [...giaiDB];
      if (giaiCheck.some((g) => (g + "").endsWith(so))) {
        tong += 76;
      }
    }
  } else if (kieuDanh.startsWith("dd")) {
    console.log(`Tính giải Đuôi với số:`, soDanhArr);
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giai7] : [...giai8];
      if (giaiCheck.some((g) => (g + "").startsWith(so))) {
        tong += 76;
      }
    }
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giaiDB] : [...giaiDB];
      if (giaiCheck.some((g) => (g + "").endsWith(so))) {
        tong += 76;
      }
    }
  } else if (kieuDanh.startsWith("xdao") || kieuDanh.startsWith("x")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [giaiDB, ...giai6] : [giaiDB, giai7];
      // console.log(giaiCheck);
      if (giaiCheck.some((g) => (g + "").endsWith(so))) {
        tong += 660;
      }
    }
  } else if (kieuDanh.startsWith("da")) {
    let round = parseInt(kieuDanh.replace("da", ""));
    if (isNaN(round)) round = 2; // Nếu không có số => mặc định là 2

    if (round >= 2) {
      const tienDa = mien === "Miền Bắc" ? 660 : 560;

      // B1: Tách từng cặp 2 số từ maDanh (VD: "4500" => ["45", "00"])
      const soDanhArr = [];
      maDanh.split(".").forEach((str) => {
        for (let i = 0; i + 1 < str.length; i += 2) {
          soDanhArr.push(str.substring(i, i + 2));
        }
      });

      // B2: Lấy theo round, nhưng không vượt quá độ dài mảng
      const soCanLay = Math.min(round, soDanhArr.length);
      const soDaXet = soDanhArr.slice(0, soCanLay);

      // B3: Tạo các cặp và kiểm tra trúng cả hai số trong một cặp
      for (let i = 0; i < soDaXet.length - 1; i++) {
        for (let j = i + 1; j < soDaXet.length; j++) {
          const a = soDaXet[i];
          const b = soDaXet[j];
          const trungA = tatCaSo.some((g) => g.endsWith(a));
          const trungB = tatCaSo.some((g) => g.endsWith(b));
          if (trungA && trungB) tong += tienDa;
        }
      }
    }
  }

  function xacDinhMien(provinceNames) {
    const lowerNames = provinceNames.map((name) => name.toLowerCase().trim());

    if (
      lowerNames.every((name) =>
        bacTowns.some((t) => t.name.toLowerCase() === name)
      )
    ) {
      return "Miền Bắc";
    } else if (
      lowerNames.every((name) =>
        trungTowns.some((t) => t.name.toLowerCase() === name)
      )
    ) {
      return "Miền Trung";
    } else if (
      lowerNames.every((name) =>
        namTowns.some((t) => t.name.toLowerCase() === name)
      )
    ) {
      return "Miền Nam";
    } else {
      return "Nhiều miền";
    }
  }

  return {
    tong,
    mien: xacDinhMien(provinces), // tùy logic bạn xác định
    soTrung: [], // nếu cần liệt kê
  };
}
