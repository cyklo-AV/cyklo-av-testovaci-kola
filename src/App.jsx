import { useState } from "react";
import html2pdf from "html2pdf.js";

const BIKES = [
  {
    name: "Rock Machine Gravelride 500",
    price: 400,
    deposit: 5000,
    frames: ["RM500-001", "RM500-002"]
  },
  {
    name: "CTM Koyuk 3.0 2024",
    price: 500,
    deposit: 7000,
    frames: ["CTM-001"]
  },
  {
    name: "Pells RAW 3 2025",
    price: 500,
    deposit: 7000,
    frames: ["PELLS-001"]
  },
  {
    name: "Rock Machine Lukk CR 90 2025",
    price: 700,
    deposit: 10000,
    frames: ["LUKK-001"]
  }
];

const EXTRAS = [
  { id: "bags", label: "Brašny Acepac", price: 150 },
  { id: "lights", label: "Osvětlení", price: 80 }
];

export default function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bike: BIKES[0].name,
    frame: BIKES[0].frames[0],
    price: BIKES[0].price,
    days: 1,
    deposit: BIKES[0].deposit,
    extras: {},
    airtag: false,
    idType: "OP",
    idNumber: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const toggleExtra = (id) => {
    setForm({
      ...form,
      extras: { ...form.extras, [id]: !form.extras[id] }
    });
  };

  const extrasSum = EXTRAS.reduce(
    (sum, e) => sum + (form.extras[e.id] ? e.price : 0),
    0
  );

  const total = (Number(form.price) + extrasSum) * Number(form.days);

  const generateQR = (amount, message, vs) => {
    const iban = "CZ4955000000000794545052";

    const spayd = `SPD*1.0*ACC:${iban}*AM:${Number(amount).toFixed(
      2
    )}*CC:CZK*X-VS:${vs}*MSG:${message}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      spayd
    )}`;
  };

  const generatePDF = () => {
    const contractId = Date.now();
    const vs = contractId.toString().slice(-10);
    const now = new Date();

    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Smlouva o výpůjčce kola</h2>

        <p><strong>Číslo:</strong> ${contractId}</p>
        <p><strong>Datum:</strong> ${now.toLocaleString("cs-CZ")}</p>
        <p><strong>VS:</strong> ${vs}</p>

        <hr/>

        <p><strong>Zákazník:</strong><br/>
        ${form.name}<br/>
        ${form.phone}<br/>
        ${form.idType}: ${form.idNumber}</p>

        <p><strong>Kolo:</strong> ${form.bike} (${form.frame})</p>

        <p><strong>Cena:</strong> ${total} Kč</p>
        <p><strong>Kauce:</strong> ${form.deposit} Kč</p>

        <hr/>

        <p><strong>QR Zápůjčné</strong></p>
        <img src="${generateQR(total, "ZAPUJCKA", vs)}" width="180"/>

        <p><strong>QR Kauce</strong></p>
        <img src="${generateQR(form.deposit, "KAUCE", vs)}" width="180"/>

        <hr/>

        <p><strong>Doplňky:</strong>
        ${
          EXTRAS.filter((e) => form.extras[e.id])
            .map((e) => e.label)
            .join(", ") || "žádné"
        }</p>

        <p>AirTag: ${form.airtag ? "ANO" : "NE"}</p>

        <br/><br/>
        <p style="font-size:12px;">
          Souhlas se zpracováním osobních údajů.
        </p>

        <p>Podpis: ____________________</p>
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = content;

    html2pdf()
      .set({
        margin: 10,
        filename: `smlouva_${vs}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>cyklo-AV TESTovací kola</h1>

      <input name="name" placeholder="Jméno" onChange={handleChange} />
      <br /><br />

      <input name="phone" placeholder="Telefon" onChange={handleChange} />
      <br /><br />

      <select name="idType" onChange={handleChange} value={form.idType}>
        <option value="OP">OP</option>
        <option value="PAS">Pas</option>
      </select>

      <br /><br />

      <input name="idNumber" placeholder="Číslo dokladu" onChange={handleChange} />

      <br /><br />

      <select
        value={form.bike}
        onChange={(e) => {
          const selected = BIKES.find((b) => b.name === e.target.value);
          setForm({
            ...form,
            bike: selected.name,
            price: selected.price,
            deposit: selected.deposit,
            frame: selected.frames[0]
          });
        }}
      >
        {BIKES.map((b) => (
          <option key={b.name}>{b.name}</option>
        ))}
      </select>

      <br /><br />

      <h3>Celkem: {total} Kč</h3>

      <button onClick={generatePDF}>
        Vygenerovat PDF smlouvu
      </button>
    </div>
  );
}
