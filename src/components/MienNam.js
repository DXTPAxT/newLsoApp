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
  Sunday: ["tigi", "kigi", "dalat"], // Tiền Giang, Kiên Giang, Đà Lạt
  Monday: ["cama", "doth", "tphc"], // Cà Mau, Đồng Tháp, TPHCM
  Tuesday: ["bali", "betr", "vuta"], // Bạc Liêu, Bến Tre, Vũng Tàu
  Wednesday: ["cath", "dona", "sotr"], // Cần Thơ, Đồng Nai, Sóc Trăng
  Thursday: ["angi", "bith", "tani"], // An Giang, Bình Thuận, Tây Ninh
  Friday: ["bidh", "trvi", "vilo"], // Bình Dương, Trà Vinh, Vĩnh Long
  Saturday: ["biph", "hagi", "loan", "tphc"], // Bình Phước, Hậu Giang, Long An, TPHCM
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

function MienNam() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = dayjs().format("DD/MM/YYYY");
  const todayKey = dayjs().format("dddd"); // Monday, Tuesday, ...

  const todayTownCodes = schedule[todayKey] || [];
  const todayTowns = namTowns.filter((t) => todayTownCodes.includes(t.code));

  useEffect(() => {
    const fetchAll = async (retryCount = 5) => {
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
            const match = list?.find((i) => i.turnNum === today);

            if (match) {
              validResults.push({ province: town.name, data: match });
              success = true;
            } else {
              attempts++;
              await new Promise((resolve) => setTimeout(resolve, 3000)); // chờ 5s rồi thử lại
            }
          } catch (err) {
            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 3000)); // lỗi thì chờ 5s rồi thử lại
          }
        }
      }

      setResults(validResults);
      setLoading(false);
    };

    fetchAll();
  }, [today]);

  if (loading) return <p>Đang tải miền Nam...</p>;

  if (results.length === 0) {
    return (
      <p style={{ color: "red" }}>
        Hôm nay ({today}) chưa có kết quả xổ số miền Nam nào được cập nhật.
      </p>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Kết quả xổ số Miền Nam - {today}</h2>
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
