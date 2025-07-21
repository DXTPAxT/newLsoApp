export function tinhKetQuaTrungThuongMotKieu(kieuDanh, maDanh, provinceName, allResults) {
  let tong = 0;
  const ketquaDai = allResults.find(
    res => res.province.toLowerCase().trim() === provinceName.toLowerCase().trim()
  );
  if (!ketquaDai) return 0;
  
  const tatCaSo = [];
  for (const prizeList of Object.values(ketquaDai.data.award || {})) {
    if (Array.isArray(prizeList)) {
      tatCaSo.push(...prizeList);
    } else {
      tatCaSo.push(prizeList);
    }
  }

  const giaiDB = ketquaDai.data.award?.g0 || "";
  const giai6 = ketquaDai.data.award?.g6 || [];
  const giai7 = ketquaDai.data.award?.g7 || [];
  const soDanhArr = maDanh.split(".");

  if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 2) {
    for (const so of soDanhArr) {
      if (tatCaSo.some(trung => trung.endsWith(so))) tong += 76;
    }
  } else if (kieuDanh.startsWith("bao") && soDanhArr[0].length === 3) {
    for (const so of soDanhArr) {
      if (tatCaSo.some(trung => trung.endsWith(so))) tong += 660;
    }
  } else if (["dd", "dau", "duoi", "dui"].includes(kieuDanh)) {
    console.log("check dau duoi ok");
    for (const so of soDanhArr) {
      const dau = so[0];
      const duoi = so.slice(-1);
      for (const tr of tatCaSo) {
        if (tr.startsWith(dau) || tr.endsWith(duoi)) {
          tong += 76;
          break;
        }
      }
    }
  } else if (kieuDanh.startsWith("xdao") || kieuDanh === "x") {
    for (const so of soDanhArr) {
      const isBac = provinceName.toLowerCase().includes("bắc");
      const giaiCheck = isBac ? [giaiDB, ...giai6] : [giaiDB, ...giai7];
      if (giaiCheck.some(g => g.endsWith(so))) {
        tong += 660;
      }
    }
  } else if (kieuDanh.startsWith("da")) {
    const round = parseInt(kieuDanh.replace("da", "")) || 2;
    const combos = getDaCombinations(soDanhArr, round);
    const tienDa = provinceName.toLowerCase().includes("bắc") ? 660 : 560;
    for (const [a, b] of combos) {
      const trungA = tatCaSo.some(g => g.endsWith(a));
      const trungB = tatCaSo.some(g => g.endsWith(b));
      if (trungA && trungB) tong += tienDa;
    }
  }

  return tong;
}

function getDaCombinations(arr, round) {
  const results = [];
  const limit = Math.min(arr.length, round);
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      results.push([arr[i], arr[j]]);
    }
  }
  return results;
}
