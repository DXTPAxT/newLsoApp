import axios from "axios";
import dayjs from "dayjs";

// Danh sách các tỉnh thành theo 3 miền
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

// Lịch quay cho từng miền
const trungSchedule = {
  Sunday: ["kotu", "khho", "thth"], // Kon Tum - Khánh Hòa - Thừa Thiên Huế (Ktum - Khoa) ✔
  Monday: ["phye", "thhu"],         // Phú Yên - Huế (Pyen - Hue) ✔
  Tuesday: ["dakl", "quna"],        // Đắk Lắk - Quảng Nam (Dlak - Qnam) ✔
  Wednesday: ["dana", "khho"],      // Đà Nẵng - Khánh Hòa (Dnang - Khoa) ✔
  Thursday: ["bidi", "qutr", "qubi"], // Bình Định - Quảng Trị - Quảng Bình (Bdinh - Qtri) ✔
  Friday: ["gila", "nith"],         // Gia Lai - Ninh Thuận (Glai - Nthuan) ✔
  Saturday: ["dana", "qung", "dano"], // Đà Nẵng - Quảng Ngãi - Đắk Nông (Dnang - Qngai) ✔
};

const namSchedule = {
  Sunday: ["tigi", "kigi", "dalat"], // Tiền Giang, Kiên Giang, Đà Lạt (Tgiang - Kgiang) ✔
  Monday: ["tphc", "doth", "cama"], // TPHCM - Đồng Tháp - Cà Mau (Tpho - Dthap) ✔
  Tuesday: ["betr", "vuta", "bali"], // Bến Tre - Vũng Tàu - Bạc Liêu (Btre - Vtau) ✔
  Wednesday: ["dona", "cath", "sotr"], // Đồng Nai - Cần Thơ - Sóc Trăng (Dnai - Ctho) ✔
  Thursday: ["tani", "angi", "bith"], // Tây Ninh - An Giang - Bình Thuận (Tninh - Agiang) ✔
  Friday: ["vilo", "bidh", "trvi"], // Vĩnh Long - Bình Dương - Trà Vinh (Vlong - Bduong) ✔
  Saturday: ["tphc", "loan", "biph", "hagi"], // TPHCM - Long An - Bình Phước - Hậu Giang (Tpho - Lan) ✔
};

export async function loadAllXosoResults() {
  const today = dayjs().format("DD/MM/YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD/MM/YYYY");
  const dayName = dayjs().format("dddd");
  const yesterdayName = dayjs().subtract(1, "day").format("dddd");

  const provincesToCheck = [];

  // Miền Bắc quay mỗi ngày
  provincesToCheck.push(...bacTowns);

  // Miền Trung quay theo lịch
  const trungTodayCodes = trungSchedule[dayName] || [];
  provincesToCheck.push(
    ...trungTowns.filter((p) => trungTodayCodes.includes(p.code))
  );

  // Miền Nam quay theo lịch
  const namTodayCodes = namSchedule[dayName] || [];
  provincesToCheck.push(
    ...namTowns.filter((p) => namTodayCodes.includes(p.code))
  );

  const allResults = [];

  for (let p of provincesToCheck) {
    try {
      const res = await axios.get(
        `https://xoso188.net/api/front/open/lottery/history/list/5/${p.code}`
      );
      const list = res.data?.t?.issueList || [];
      const found = list.find((item) => item.turnNum === today);
      if (found) {
        allResults.push({ province: p.name, data: found });
      }
    } catch (e) {
      console.error("Lỗi fetch", p.code, e.message);
    }
  }

  return allResults;
}
