import dayjs from "dayjs";

// Danh sách tỉnh thành theo miền
const bacTowns = [{ code: "miba", name: "Miền Bắc" }];
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

// Lịch quay
const trungSchedule = {
  Sunday: ["kotu", "khho", "thth"],
  Monday: ["phye", "thth"],
  Tuesday: ["dalak", "quna"],
  Wednesday: ["dana", "khho"],
  Thursday: ["bidi", "qutr", "qubi"],
  Friday: ["gila", "nith"],
  Saturday: ["dana", "qung", "dano"],
};

const namSchedule = {
  Sunday: ["tigi", "kigi", "dalat"],
  Monday: ["tphc", "doth", "cama"],
  Tuesday: ["betr", "vuta", "bali"],
  Wednesday: ["dona", "cath", "sotr"],
  Thursday: ["tani", "angi", "bith"],
  Friday: ["vilo", "bidu", "trvi"],
  Saturday: ["tphc", "loan", "biph", "hagi"],
};

/**
 * Trích danh sách tỉnh thành từ chuỗi mã hoặc dạng đặc biệt như "2dt"
 * @param {string} chuoiDai - Chuỗi liền nhau, ví dụ: "ktumkhoa" hoặc "2dt"
 * @returns {string[]} Danh sách tên tỉnh đầy đủ
 */
export function tachDanhSachTinhThanh(chuoiDai, maDais, tenDais) {
  const input = chuoiDai.toLowerCase().trim();

  // Xử lý dạng "2dt", "3dn"...
  const matchSoMien = input.match(/^(\d+)(dt|dn)$/);
  if (matchSoMien) {
    const soLuong = parseInt(matchSoMien[1], 10);
    const loai = matchSoMien[2];
    const ngay = dayjs().format("dddd"); // Ví dụ: "Monday"
    const homqua = dayjs().subtract(1, "day").format("dddd"); // Ví dụ: "Sunday"

    let schedule = [];
    if (loai === "dt") schedule = trungSchedule[homqua] || [];
    if (loai === "dn") schedule = namSchedule[homqua] || [];

    const layMaTinh = schedule.slice(0, soLuong);
    const tinhTuMa = [...trungTowns, ...namTowns].filter((t) =>
      layMaTinh.includes(t.code)
    );
    return tinhTuMa.map((t) => t.name);
  }

  // Nếu không phải dạng "2dt", tách từ mã đài
  const chuoiLower = chuoiDai.toLowerCase();
  let ketQua = [];

  for (let i = 0; i < maDais.length; i++) {
    const ma = maDais[i].toLowerCase();
    if (chuoiLower.includes(ma)) {
      ketQua.push(tenDais[i]);
    }
  }

  return ketQua;
}
