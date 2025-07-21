import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

// Danh sách tỉnh theo thứ (đúng lịch mở thưởng)
const todayTowns = {
  Sunday: ["kotu", "khho", "thth"], // Kon Tum - Khánh Hòa - Thừa Thiên Huế (Ktum - Khoa) ✔
  Monday: ["phye", "thhu"], // Phú Yên - Huế (Pyen - Hue) ✔
  Tuesday: ["dakl", "quna"], // Đắk Lắk - Quảng Nam (Dlak - Qnam) ✔
  Wednesday: ["dana", "khho"], // Đà Nẵng - Khánh Hòa (Dnang - Khoa) ✔
  Thursday: ["bidi", "qutr", "qubi"], // Bình Định - Quảng Trị - Quảng Bình (Bdinh - Qtri) ✔
  Friday: ["gila", "nith"], // Gia Lai - Ninh Thuận (Glai - Nthuan) ✔
  Saturday: ["dana", "qung", "dano"], // Đà Nẵng - Quảng Ngãi - Đắk Nông (Dnang - Qngai) ✔
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

function MienTrung() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = dayjs().format("DD/MM/YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD/MM/YYYY");

  useEffect(() => {
    const fetchAll = async (retryCount = 5) => {
      const validResults = [];
      const weekday = dayjs().format("dddd");
      const previousWeekday = dayjs().subtract(1, "day").format("dddd");
      const todayTownCodes = todayTowns[previousWeekday] || [];

      const todayTownList = trungTowns.filter((town) =>
        todayTownCodes.includes(town.code)
      );

      for (let town of todayTownList) {
        let success = false;
        let attempt = 0;
        let result = null;

        while (!success && attempt < retryCount) {
          try {
            const res = await axios.get(
              `https://xoso188.net/api/front/open/lottery/history/list/5/${town.code}`
            );
            const list = res.data?.t?.issueList;
            const match = list?.find((i) => i.turnNum === yesterday);

            if (match) {
              result = match;
              success = true;
            } else {
              attempt++;
              if (attempt < retryCount) {
                await new Promise((r) => setTimeout(r, 1000));
              }
            }
          } catch (error) {
            attempt++;
            if (attempt < retryCount) {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        if (result) {
          validResults.push({ province: town.name, data: result });
        }
      }

      setResults(validResults);
      setLoading(false);
    };

    fetchAll();
  }, [today]);

  if (loading) return <p>Đang tải kết quả miền Trung...</p>;

  if (results.length === 0) {
    return <p style={{ color: "red" }}>Chưa có kết quả miền Trung hôm nay.</p>;
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Kết quả xổ số Miền Trung - {today}
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

export default MienTrung;
