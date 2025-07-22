export function tinhKetQuaTrungThuongMotKieu(
  kieuDanh,
  maDanh,
  provinceList,
  allResults
) {
  const bacTowns = [
    { code: "miba", name: "Miền Bắc" },
    { code: "hano", name: "Hà Nội" },
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
  const tatCaSo = [];
  const soTheoDai = []; // Mỗi phần tử: { dai: "Tên đài", so: "12345" }
  const giaiDB = [];
  const giai6 = [];
  const giai7 = [];
  const giai8 = [];
  const provinces = Array.isArray(provinceList) ? provinceList : [provinceList];
  let mien = xacDinhMien(provinces);
  const soTrungArr = [];

  // console.log(provinces);
  // console.log(allResults);

  for (const provinceName of provinces) {
    const realProvinceName =
      provinceName == "Hà Nội" ? "Miền Bắc" : provinceName;

    const ketquaDai = allResults.find(
      (res) =>
        res.province.toLowerCase().trim() ===
        realProvinceName.toLowerCase().trim()
    );

    // console.log(kieuDanh);
    // console.log(maDanh);
    // console.log(provinceName);
    // console.log(realProvinceName);
    // console.log(ketquaDai);
    // console.log("=======");

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
            soTheoDai.push(
              ...giaiN.map((so) => ({ dai: realProvinceName, so }))
            );

            // Gom riêng giải 6 và 7
            if (idx === 6) giai6.push(...giaiN); // g6
            if (idx === 7) giai7.push(...giaiN); // g7
          } else {
            tatCaSo.push(giai);
            soTheoDai.push({ dai: realProvinceName, so: giai });
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
      const count = tatCaSo.filter((trung) => trung.endsWith(so)).length;
      if (count > 0) {
        tong += count * 76;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(so);
        }
      }
    }
  } else if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 3) {
    for (const so of soDanhArr) {
      const count = tatCaSo.filter((trung) => trung.endsWith(so)).length;
      if (count > 0) {
        tong += count * 660;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(so);
        }
      }
    }
  } else if (kieuDanh.startsWith("dau")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giai7] : [...giai8];
      const count = giaiCheck.filter((g) => (g + "").startsWith(so)).length;
      // console.log(giai7);
      // console.log(giaiCheck);
      if (count > 0) {
        tong += count * 76;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(so);
        }
      }
    }
  } else if (kieuDanh.startsWith("duoi") || kieuDanh.startsWith("dui")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giaiDB] : [...giaiDB];
      const count = giaiCheck.filter((g) => (g + "").endsWith(so)).length;
      if (count > 0) {
        tong += count * 76;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(so);
        }
      }
    }
  } else if (kieuDanh.startsWith("dd")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giai7] : [...giai8];
      const count = giaiCheck.filter((g) => (g + "").startsWith(so)).length;
      if (count > 0) {
        tong += count * 76;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(`${so} (đầu)`);
        }
      }
    }
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [...giaiDB] : [...giaiDB];
      const count = giaiCheck.filter((g) => (g + "").endsWith(so)).length;
      if (count > 0) {
        tong += count * 76;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(`${so} (đuôi)`);
        }
      }
    }
  } else if (kieuDanh.startsWith("xdao") || kieuDanh.startsWith("x")) {
    for (const so of soDanhArr) {
      const giaiCheck = isBac ? [giaiDB, ...giai6] : [giaiDB, giai7];
      const flatGiai = giaiCheck.flat(); // nếu có mảng lồng
      const count = flatGiai.filter((g) => (g + "").endsWith(so)).length;
      if (count > 0) {
        tong += count * 660;
        for (let i = 0; i < count; i++) {
          soTrungArr.push(so);
        }
      }
    }
  } else if (kieuDanh.startsWith("da")) {
    let round = parseInt(kieuDanh.replace("da", ""));
    if (isNaN(round)) round = 2;

    const soDai = provinces.length;
    let tienDa = 0;
    if (soDai === 1) {
      tienDa = mien === "Miền Bắc" ? 660 : 750;
    } else {
      tienDa = mien === "Miền Bắc" ? 660 : 560;
    }

    // Gom số theo đài từ soTheoDai
    const soTheoDaiMap = {};
    soTheoDai.forEach(({ dai, so }) => {
      if (!soTheoDaiMap[dai]) soTheoDaiMap[dai] = [];
      soTheoDaiMap[dai].push(so);
    });

    // Danh sách tổ hợp đài (2 chiều)
    const daiList = Object.keys(soTheoDaiMap);
    const toHopDai = [];
    for (let i = 0; i < daiList.length; i++) {
      for (let j = i + 1; j < daiList.length; j++) {
        toHopDai.push([daiList[i], daiList[j]]);
      }
    }

    // Tách từng cặp số từ maDanh
    maDanh.split(".").forEach((str) => {
      const soDanhArr = [];
      for (let i = 0; i + 1 < str.length; i += 2) {
        soDanhArr.push(str.substring(i, i + 2));
      }

      const soCanLay = Math.min(round, soDanhArr.length);
      const soDaXet = soDanhArr.slice(0, soCanLay);

      // Tạo danh sách các cặp số từ soDaXet
      for (let i = 0; i < soDaXet.length - 1; i++) {
        for (let j = i + 1; j < soDaXet.length; j++) {
          const a = soDaXet[i];
          const b = soDaXet[j];

          // Tìm tất cả nơi xuất hiện của số a và b
          const aDaiArr = soTheoDai.filter((x) => x.so.endsWith(a));
          const bDaiArr = soTheoDai.filter((x) => x.so.endsWith(b));

          // Duyệt tất cả tổ hợp (a, b)
          aDaiArr.forEach((aObj) => {
            bDaiArr.forEach((bObj) => {
              const daiA = aObj.dai;
              const daiB = bObj.dai;

              if (daiA === daiB) {
                // Nếu cả 2 số cùng 1 đài → tính cho tất cả tổ hợp đài
                toHopDai.forEach(([d1, d2]) => {
                  if (d1 === daiA || d2 === daiA) {
                    tong += tienDa;
                    soTrungArr.push(`${a} ${b} (${d1} - ${d2})`);
                  }
                });
              } else {
                // Nếu khác đài → chỉ tính 1 lần
                tong += tienDa;
                soTrungArr.push(`${a} ${b} (${daiA} - ${daiB})`);
              }
            });
          });
        }
      }
    });
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
    soTrung: soTrungArr, // nếu cần liệt kê
  };
}
