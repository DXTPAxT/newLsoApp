function pt(vanBan) {
  const cacMau = [
    [3, 2, 1, 1],
    [3, 2, 2, 1],
    [3, 1, 2, 2],
    [3, 1, 1, 2]
  ];

  const lines = vanBan.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const doDaiCacDoan = [];
  let count = 0;

  for (const dong of lines) {
    if (dong.trim() === '') {
      count++;
    } else {
      if (count > 0) {
        doDaiCacDoan.push(count);
        count = 0;
      }
    }
  }
  if (count > 0) {
    doDaiCacDoan.push(count);
  }

  if (doDaiCacDoan.length === 0 || doDaiCacDoan[doDaiCacDoan.length - 1] !== 3) {
    return null;
  }

  const ketQua = [];
  for (const mau of cacMau) {
    let dem = 0;
    for (let i = 0; i <= doDaiCacDoan.length - mau.length; i++) {
      if (soSanhMangCon(doDaiCacDoan, mau, i)) {
        dem++;
      }
    }
    ketQua.push(dem);
  }

  return ketQua;
}

function soSanhMangCon(a, b, start) {
  for (let i = 0; i < b.length; i++) {
    if (a[start + i] !== b[i]) return false;
  }
  return true;
}

module.exports = { pt };
