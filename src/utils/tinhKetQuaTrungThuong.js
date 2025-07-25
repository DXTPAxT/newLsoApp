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
        soTrungArr.push(so + `(${count})`);
      }
    }
  } else if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 3) {
    for (const so of soDanhArr) {
      const count = tatCaSo.filter((trung) => trung.endsWith(so)).length;
      if (count > 0) {
        tong += count * 660;
        soTrungArr.push(so + `(${count})`);
      }
    }
  } else if (kieuDanh.startsWith("bdao") && soDanhArr[0].length === 2) {
    for (const so of soDanhArr) {
      // console.log(generatePermutations(so));
      for (const soDao of generatePermutations(so)) {
        const count = tatCaSo.filter((trung) => trung.endsWith(soDao)).length;
        // console.log(`Đang xét: ${soDao}, Số trúng: ${count}`);
        if (count > 0) {
          tong += count * 76;
          soTrungArr.push(soDao + `(${count})`);
        }
      }
    }
  } else if (kieuDanh.startsWith("bdao") && soDanhArr[0].length === 3) {
    for (const so of soDanhArr) {
      // console.log(generatePermutations(so));
      for (const soDao of generatePermutations(so)) {
        const count = tatCaSo.filter((trung) => trung.endsWith(soDao)).length;
        if (count > 0) {
          tong += count * 660;
          soTrungArr.push(soDao + `(${count})`);
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
  } else if (kieuDanh.startsWith("x") && !kieuDanh.startsWith("xdao")) {
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
  } else if (kieuDanh.startsWith("xdao")) {
    for (const so of soDanhArr) {
      for (const soDao of generatePermutations(so)) {
        const giaiCheck = isBac ? [giaiDB, ...giai6] : [giaiDB, giai7];
        const flatGiai = giaiCheck.flat(); // nếu có mảng lồng
        const count = flatGiai.filter((g) => (g + "").endsWith(soDao)).length;
        if (count > 0) {
          tong += count * 660;
          for (let i = 0; i < count; i++) {
            soTrungArr.push(soDao + `(${count})`);
          }
        }
      }
    }
  } else if (kieuDanh.startsWith("da") && !kieuDanh.includes("x")) {
    const round = parseInt(kieuDanh.replace("da", "")) || 2;
    const tienDa =
      provinces.length === 1
        ? mien === "Miền Bắc"
          ? 660
          : 750
        : mien === "Miền Bắc"
        ? 660
        : 560;

    // Bước 1: Tạo các cặp đài
    const capDaiArr = [];
    for (let i = 0; i < provinces.length; i++) {
      for (let j = i + 1; j < provinces.length; j++) {
        capDaiArr.push([provinces[i], provinces[j]]);
      }
    }

    // Bước 2: Tách maDanh thành mảng cặp số
    const capSoArr = maDanh.split(".").map((str) => {
      const numbers = [];
      for (let i = 0; i + 1 < str.length; i += 2) {
        numbers.push(str.substring(i, i + 2));
      }

      const pairs = [];
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          pairs.push([numbers[i], numbers[j]]);
        }
      }

      return pairs;
    });

    // console.log("Đài truyền vào:", provinceList);
    // console.log("Đài:", provinces);
    console.log("Cặp đài:", capDaiArr);
    console.log(capSoArr);

    if (provinceList.length >= 2) {
      // Bước 3: Duyệt từng cặp đài và từng cặp số
      capDaiArr.forEach(([d1, d2]) => {
        for (let i = 0; i < capSoArr.length; i++) {
          const capSoChuaXet = [...capSoArr[i]]; // copy mảng gốc
          for (let i = 0; i < capSoChuaXet.length; i++) {
            console.log(`Xét cặp đài: ${d1} - ${d2}`);
            console.log("Cặp số chưa xét:", capSoChuaXet[i]);
            const cap = capSoChuaXet[i];
            // console.log(cap);
            if (cap.length < 2) continue;
            const [s1, s2] = cap;
            console.log(`Cặp số: ${s1} - ${s2}`);

            const soTrungTheoCapDai = [];

            for (const so of [s1, s2]) {
              for (const { dai, so: soKQ } of soTheoDai) {
                if ((dai === d1 || dai === d2) && soKQ.endsWith(so)) {
                  soTrungTheoCapDai.push({ dai, soKQ });
                }
              }
            }
            for (const so of soTrungTheoCapDai) {
              console.log(`Số trúng theo cặp đài: ${so.soKQ} (${so.dai})`);
            }

            var conSo1;
            var conSo2;
            var so1;
            var so2;

            do {
              conSo1 = false;
              conSo2 = false;
              for (var j = 0; j < soTrungTheoCapDai.length; j++) {
                if (
                  soTrungTheoCapDai[j].soKQ.endsWith(s1) &&
                  conSo1 === false
                ) {
                  conSo1 = true;
                  so1 = soTrungTheoCapDai[j];
                  soTrungTheoCapDai.splice(j, 1); // loại bỏ số đã trúng
                  j--; // lùi chỉ số do đã xóa phần tử
                } else if (
                  soTrungTheoCapDai[j].soKQ.endsWith(s2) &&
                  conSo2 === false
                ) {
                  conSo2 = true;
                  so2 = soTrungTheoCapDai[j];
                  soTrungTheoCapDai.splice(j, 1); // loại bỏ số đã trúng
                  j--; // lùi chỉ số do đã xóa phần tử
                }
              }
              if (conSo1 && conSo2) {
                // Nếu cả 2 số đều trúng
                soTrungArr.push(`${s1} ${s2} (${d1} - ${d2})`);
                tong += tienDa;
              }
            } while (conSo1 && conSo2);

            // Nếu có ít nhất 1 số trúng đài
            if (soTrungTheoCapDai.length >= 1) {
              soTrungArr.push(`${s1} ${s2} (${d1} - ${d2})`);
              tong += tienDa;
            }

            capSoChuaXet.splice(i, 1); // loại bỏ cặp số đã trúng
            i--; // lùi chỉ số do đã xóa phần tử
          }
        }
      });
    } else {
      const dai = provinces[0];
      for (let i = 0; i < capSoArr.length; i++) {
        const capSoChuaXet = [...capSoArr[i]]; // copy mảng gốc
        for (let i = 0; i < capSoChuaXet.length; i++) {
          console.log(`Xét đài: ${dai}`);
          console.log("Cặp số chưa xét:", capSoChuaXet[i]);
          const cap = capSoChuaXet[i];
          console.log(cap);
          if (cap.length < 2) continue;
          const [s1, s2] = cap;
          console.log(`Cặp số: ${s1} - ${s2}`);
          const soTrungTheoDai = [];

          for (const so of [s1, s2]) {
            for (const { dai, so: soKQ } of soTheoDai) {
              if (dai === dai && soKQ.endsWith(so)) {
                soTrungTheoDai.push(so);
              }
            }
          }

          const used = new Array(soTrungTheoDai.length).fill(false);
          let count = 0;

          for (let i = 0; i < soTrungTheoDai.length; i++) {
            if (used[i]) continue;
            if (soTrungTheoDai[i] !== s1 && soTrungTheoDai[i] !== s2) continue;

            for (let j = i + 1; j < soTrungTheoDai.length; j++) {
              if (used[j]) continue;
              const pair = [soTrungTheoDai[i], soTrungTheoDai[j]];
              if (
                pair.includes(s1) &&
                pair.includes(s2) &&
                soTrungTheoDai[i] !== soTrungTheoDai[j]
              ) {
                used[i] = true;
                used[j] = true;
                count++;
                break;
              }
            }
          }

          if (count > 0) {
            tong += count * tienDa;
            soTrungArr.push(`${s1} ${s2} (${count})`);
          }
        }
      }
    }
  } else if (kieuDanh.startsWith("da") && kieuDanh.includes("x")) {
    const round = parseInt(kieuDanh.replace("da", "")) || 2;
    const tienDa = mien === "Miền Bắc" ? 700 : 750;

    // Bước 2: Tách maDanh thành mảng cặp số
    const capSoArr = maDanh.split(".").map((str) => {
      const numbers = [];
      for (let i = 0; i + 1 < str.length; i += 2) {
        numbers.push(str.substring(i, i + 2));
      }

      const pairs = [];
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          pairs.push([numbers[i], numbers[j]]);
        }
      }

      return pairs;
    });

    // console.log("Đài truyền vào:", provinceList);
    // console.log("Đài:", provinces);
    // console.log("Cặp đài:", capDaiArr);
    // console.log(capSoArr);

    const dai = provinces[0];
    for (let i = 0; i < capSoArr.length; i++) {
      const capSoChuaXet = [...capSoArr[i]]; // copy mảng gốc
      for (let i = 0; i < capSoChuaXet.length; i++) {
        console.log(`Xét đài: ${dai}`);
        console.log("Cặp số chưa xét:", capSoChuaXet[i]);
        const cap = capSoChuaXet[i];
        console.log(cap);
        if (cap.length < 2) continue;
        const [s1, s2] = cap;
        console.log(`Cặp số: ${s1} - ${s2}`);
        const soTrungTheoDai = [];

        for (const so of [s1, s2]) {
          for (const { dai, so: soKQ } of soTheoDai) {
            if (dai === dai && soKQ.endsWith(so)) {
              soTrungTheoDai.push(so);
            }
          }
        }

        var count1 = 0;
        var count2 = 0;

        for (let j = 0; j < soTrungTheoDai.length; j++) {
          if (soTrungTheoDai[j] === s1) {
            count1++;
          } else if (soTrungTheoDai[j] === s2) {
            count2++;
          }
        }

        if (soTrungTheoDai.includes(s1) && soTrungTheoDai.includes(s2)) {
          tong += (count1 * tienDa + count2 * tienDa) / 2;
          soTrungArr.push(`${s1}(${count1}) ${s2}(${count2})`);
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
    soTrung: soTrungArr, // nếu cần liệt kê
  };
}

function generatePermutations(num) {
  const digits = String(num).split(""); // chuyển số thành mảng ký tự
  const results = new Set(); // dùng Set để tránh trùng

  function backtrack(path, used) {
    if (path.length === digits.length) {
      const numberStr = path.join("");
      if (numberStr[0] !== "0") {
        results.add(Number(numberStr));
      }
      return;
    }

    for (let i = 0; i < digits.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(digits[i]);
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([], Array(digits.length).fill(false));
  return Array.from(results);
}
