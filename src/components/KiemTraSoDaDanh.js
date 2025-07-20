import React, { useState, useEffect } from "react";
import axios from "axios";

function KiemTraSoDaDanh({ daiCode = "tphc", soDanh = [] }) {
  const [loading, setLoading] = useState(true);
  const [ketQua, setKetQua] = useState(null);
  const [trungSo, setTrungSo] = useState([]);

  useEffect(() => {
    if (!daiCode) return;
    setLoading(true);

    axios
      .get(`https://xoso188.net/api/front/open/lottery/history/list/5/${daiCode}`)
      .then((res) => {
        const list = res.data?.t?.issueList || [];
        if (list.length > 0) {
          const chiTiet = JSON.parse(list[0].data.detail);
          setKetQua(chiTiet);
          kiemTra(chiTiet, soDanh);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải kết quả:", err);
        setLoading(false);
      });
  }, [daiCode, soDanh]);

  // Hàm kiểm tra trúng số
  const kiemTra = (chiTiet, soDanh) => {
    const trung = [];

    for (const so of soDanh) {
      for (const [giai, value] of Object.entries(chiTiet)) {
        const danhSachGiai = value.split(",").map((s) => s.trim());
        for (const kq of danhSachGiai) {
          if (kq.endsWith(so)) {
            trung.push({ so, giai, kq });
          }
        }
      }
    }

    setTrungSo(trung);
  };

  return (
    <div className="border p-4 rounded-xl shadow mt-4 bg-white">
      <h2 className="text-xl font-bold mb-3">Kết quả kiểm tra ({daiCode.toUpperCase()})</h2>

      {loading ? (
        <p>Đang tải kết quả...</p>
      ) : (
        <>
          {trungSo.length > 0 ? (
            <ul className="list-disc list-inside text-green-600">
              {trungSo.map((item, index) => (
                <li key={index}>
                  Số <strong>{item.so}</strong> trúng <strong>{item.giai}</strong> với kết quả <strong>{item.kq}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-500">Không trúng số nào.</p>
          )}
        </>
      )}
    </div>
  );
}

export default KiemTraSoDaDanh;
