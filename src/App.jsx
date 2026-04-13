import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // 👉 HLAVNÍ FUNKCE – PDF
  const printContract = async () => {
    const contractId = Date.now();
    const now = new Date();
    const formatDate = now.toLocaleString("cs-CZ");
    const variableSymbol = contractId.toString().slice(-10);

    const generateQR = (amount, message) => {
      const iban = "CZ4955000000000794545052";

      const spayd = `SPD*1.0*ACC:${iban}*AM:${Number(amount).toFixed(
        2
      )}*CC:CZK*X-VS:${variableSymbol}*MSG:${message}`;

      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        spayd
      )}`;
    };

    const element = document.createElement("div");

    element.innerHTML = `
      <div style="font-family: Arial; padding: 20px; width: 800px;">
        <h1>Smlouva o výpůjčce kola</h1>

        <p><strong>Číslo smlouvy:</strong> ${contractId}</p>
        <p><strong>Datum:</strong> ${formatDate}</p>
        <p><strong>Variabilní symbol:</strong> ${variableSymbol}</p>

        <h3>Půjčitel</h3>
        <p>
          Aleš Vondráček - cyklo/AV<br/>
          IČ: 65099630<br/>
          Fučíkova 665, Raspenava<br/>
          Tel: +420792306880
        </p>

        <h3>Zákazník</h3>
        <p>
          ${form.name}<br/>
          ${form.phone}<br/>
          ${form.idType}: ${form.idNumber}
        </p>

        <h3>Kolo</h3>
        <p>
          ${form.bike}<br/>
          Rám: ${form.frame}
        </p>

        <h3>Výpůjčka</h3>
        <p>
          Počet dní: ${form.days}<br/>
          Cena: ${total} Kč<br/>
          Kauce: ${form.deposit} Kč
        </p>

        <h3>QR platby</h3>

        <p>Zápůjčné:</p>
        <img src="${generateQR(total, "ZAPUJCKA")}" width="150"/>

        <p>Kauce:</p>
        <img src="${generateQR(form.deposit, "KAUCE")}" width="150"/>

        <h3>Doplňky</h3>
        <p>
          ${
            EXTRAS
              .filter(e => form.extras[e.id])
              .map(e => e.label)
              .join(", ") || "žádné"
          }
        </p>

        <p>AirTag: ${form.airtag ? "ANO" : "NE"}</p>

        <br/><br/>

        <p style="font-size: 12px;">
          Zákazník souhlasí se zpracováním osobních údajů.
        </p>

        <br/>
        <p>Podpis: ________________________</p>
      </div>
    `;

    document.body.appendChild(element);

    await new Promise((resolve) => setTimeout(resolve, 500));

const canvas = await html2canvas(element, {
  useCORS: true
});
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();

    pdf.addImage(imgData, "PNG", 0, 0, width, 0);

    pdf.save(`smlouva-${contractId}.pdf`);

    document.body.removeChild(element);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>cyklo-AV TESTovací kola</h1>

      <input placeholder="Jméno" name="name" onChange={handleChange} />
      <br /><br />

      <input placeholder="Telefon" name="phone" onChange={handleChange} />
      <br /><br />

      <select name="idType" value={form.idType} onChange={handleChange}>
        <option value="OP">Občanský průkaz</option>
        <option value="PAS">Pas</option>
      </select>
      <br /><br />

      <input
        placeholder="Číslo dokladu"
        name="idNumber"
        onChange={handleChange}
      />
      <br /><br />

      <select
        value={form.bike}
        onChange={(e) => {
          const selected = BIKES.find(b => b.name === e.target.value);
          setForm({
            ...form,
            bike: selected.name,
            price: selected.price,
            deposit: selected.deposit,
            frame: selected.frames[0] || ""
          });
        }}
      >
        {BIKES.map(b => (
          <option key={b.name}>{b.name}</option>
        ))}
      </select>
      <br /><br />

      <select
        value={form.frame}
        onChange={(e) => setForm({ ...form, frame: e.target.value })}
      >
        {(BIKES.find(b => b.name === form.bike)?.frames || []).map(f => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <br /><br />

      <input type="number" value={form.price} readOnly />
      <input type="number" value={form.deposit} readOnly />

      <h3>Doplňky</h3>
      {EXTRAS.map(e => (
        <div key={e.id}>
          <label>
            <input type="checkbox" onChange={() => toggleExtra(e.id)} />
            {e.label} (+{e.price} Kč/den)
          </label>
        </div>
      ))}

      <br />

      <label>
        <input
          type="checkbox"
          name="airtag"
          checked={form.airtag}
          onChange={handleChange}
        />
        Souhlas s AirTag
      </label>

      <br /><br />

      <h2>Celkem: {total} Kč</h2>

      <button onClick={printContract}>
        Stáhnout smlouvu (PDF)
      </button>
    </div>
  );
}