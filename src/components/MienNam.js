import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

// ✅ Chỉ định các tỉnh quay theo từng ngày
const schedule = {
  Sunday: ["tigi", "kigi", "dalat"], // Tiền Giang, Kiên Giang, Đà Lạt (Tgiang - Kgiang) ✔
  Monday: ["tphc", "doth", "cama"], // TPHCM - Đồng Tháp - Cà Mau (Tpho - Dthap) ✔
  Tuesday: ["betr", "vuta", "bali"], // Bến Tre - Vũng Tàu - Bạc Liêu (Btre - Vtau) ✔
  Wednesday: ["dona", "cath", "sotr"], // Đồng Nai - Cần Thơ - Sóc Trăng (Dnai - Ctho) ✔
  Thursday: ["tani", "angi", "bith"], // Tây Ninh - An Giang - Bình Thuận (Tninh - Agiang) ✔
  Friday: ["vilo", "bidh", "trvi"], // Vĩnh Long - Bình Dương - Trà Vinh (Vlong - Bduong) ✔
  Saturday: ["tphc", "loan", "biph", "hagi"], // TPHCM - Long An - Bình Phước - Hậu Giang (Tpho - Lan) ✔
};

const prizeNames = [
  "Giải tám",
  "Giải bảy",
  "Giải sáu",
  "Giải năm",
  "Giải tư",
  "Giải ba",
  "Giải nhì",
  "Giải nhất",
  "Giải Đặc Biệt",
];

function MienNam({ selectedDate }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = dayjs().format("DD/MM/YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD/MM/YYYY");
  const todayKey = dayjs().format("dddd"); // Monday, Tuesday, ...
  const yesterdayKey = dayjs().subtract(1, "day").format("dddd");
  const selectDate = selectedDate === "yesterday" ? yesterday : today;
  const selectKey = selectedDate === "yesterday" ? yesterdayKey : todayKey;

  const todayTownCodes = schedule[selectKey] || [];
  const todayTowns = namTowns.filter((t) => todayTownCodes.includes(t.code));

  useEffect(() => {
    const currentHour = dayjs().hour();
    const isToday = selectedDate !== "yesterday";

    if (isToday && currentHour < 16) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchAll = async (retryCount = 10) => {
      const validResults = [];

      for (let town of todayTowns) {
        let attempts = 0;
        let success = false;

        while (attempts < retryCount && !success) {
          try {
            const res = await axios.get(
              `https://xoso188.net/api/front/open/lottery/history/list/5/${town.code}`
            );
            const list = res.data?.t?.issueList;
            const match = list?.find((i) => i.turnNum === selectDate);

            if (match) {
              validResults.push({ province: town.name, data: match });
              success = true;
            } else {
              attempts++;
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (err) {
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      setResults(validResults);
      setLoading(false);
    };

    fetchAll();
  }, [selectDate]);

  if (loading) return <p>Đang tải miền Nam...</p>;

  if (results.length === 0) {
    return (
      <p style={{ color: "red" }}>
        Hôm nay ({selectDate}) chưa có kết quả xổ số miền Nam nào được cập nhật.
      </p>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Kết quả xổ số Miền Nam - {selectDate}
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="6"
          style={{
            borderCollapse: "collapse",
            fontSize: "20px",
            minWidth: "600px",
            margin: "0 auto",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                Giải
              </th>
              {results.map((r, i) => (
                <th
                  key={i}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {r.province}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prizeNames.map((prize, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <strong>{prize}</strong>
                </td>
                {results.map((r, i) => {
                  const detail = JSON.parse(r.data.detail);
                  const reversedIndex = 8 - idx;
                  const prizes = Array.isArray(detail[reversedIndex])
                    ? detail[reversedIndex]
                    : [detail[reversedIndex]].filter(Boolean);
                  return (
                    <td
                      key={i}
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {prizes
                        .flatMap((p) => p.split(","))
                        .map((item, index) => (
                          <div key={index}>{item.trim()}</div>
                        ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MienNam;
