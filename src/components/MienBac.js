import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const prizeNames = [
  "Giải ĐB",
  "Giải nhất",
  "Giải nhì",
  "Giải ba",
  "Giải tư",
  "Giải năm",
  "Giải sáu",
  "Giải bảy",
];

function groupItems(items, perRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

function MienBac() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const today = dayjs().format("DD/MM/YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD/MM/YYYY");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (retryCount = 10) => {
      let attempts = 0;
      let success = false;

      while (attempts < retryCount && !success) {
        try {
          const res = await axios.get(
            "https://xoso188.net/api/front/open/lottery/history/list/5/miba"
          );
          const list = res.data?.t?.issueList || [];

          const matched = list.find(
            (item) =>
              item.turnNum === today || item.issueDate === today
          );

          if (matched) {
            if (isMounted) {
              setResult(matched);
              setError("");
              setLoading(false);
            }
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

      if (!success && isMounted) {
        setError("Không lấy được kết quả miền Bắc sau nhiều lần thử.");
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Đang tải miền Bắc...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const detail = JSON.parse(result.detail);

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "darkred" }}>
        KẾT QUẢ XỔ SỐ MIỀN BẮC
      </h2>
      <table
        border="1"
        cellPadding="6"
        style={{
          borderCollapse: "collapse",
          margin: "0 auto",
          fontSize: "18px",
          minWidth: "400px",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>Giải</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          {prizeNames.map((name, idx) => {
            const prize = detail[idx];
            const items = Array.isArray(prize)
              ? prize.flatMap((s) => s.split(",").map((s) => s.trim()))
              : [prize].filter(Boolean);

            let perRow = 3;
            if (idx === 0 || idx === 1) perRow = 1;
            else if (idx >= 2 && idx <= 5) perRow = 3;
            else perRow = 2;

            const rows = groupItems(items, perRow);

            return (
              <tr key={idx}>
                <td>
                  <strong>{name}</strong>
                </td>
                <td>
                  {rows.map((row, i) => (
                    <div key={i} style={{ marginBottom: "4px" }}>
                      {row.map((num, j) => (
                        <span
                          key={j}
                          style={{
                            marginRight: "15px",
                            color: idx === 0 ? "darkred" : "black",
                            fontWeight: idx === 0 ? "bold" : "normal",
                            fontSize: idx === 0 ? "22px" : "inherit",
                          }}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MienBac;
