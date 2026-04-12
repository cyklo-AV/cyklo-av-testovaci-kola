import { useState } from "react";

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

  const printContract = () => {
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

    const content = `
      <html>
        <head>
          <title>Smlouva o výpůjčce</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { margin-bottom: 10px; }
            .section { margin-bottom: 15px; }
          </style>
        </head>
        <body>

          <h1>Smlouva o výpůjčce kola</h1>

          <div class="section">
            <strong>Číslo smlouvy:</strong> ${contractId}<br/>
            <strong>Datum:</strong> ${formatDate}<br/>
            <strong>VS:</strong> ${variableSymbol}
          </div>

          <div class="section">
            <strong>Půjčitel:</strong><br/>
            Aleš Vondráček - cyklo/AV<br/>
            IČ: 65099630<br/>
            Fučíkova 665, Raspenava<br/>
            Tel: +420792306880
          </div>

          <div class="section">
            <strong>Zákazník:</strong><br/>
            ${form.name}<br/>
            ${form.phone}<br/>
            ${form.idType}: ${form.idNumber}
          </div>

          <div class="section">
            <strong>Kolo:</strong><br/>
            ${form.bike}<br/>
            Rám: ${form.frame}
          </div>

          <div class="section">
            <strong>Výpůjčka:</strong><br/>
            Počet dní: ${form.days}<br/>
            Cena: ${total} Kč<br/>
            Kauce: ${form.deposit} Kč
          </div>

          <div class="section">
            <strong>QR platby:</strong><br/><br/>

            Zápůjčné:<br/>
            <img src="${generateQR(total, "ZAPUJCKA")}&t=${Date.now()}" width="150"/><br/><br/>

            Kauce:<br/>
            <img src="${generateQR(form.deposit, "KAUCE")}&t=${Date.now()}" width="150"/>
          </div>

          <div class="section">
            Doplňky:
            ${
              EXTRAS.filter((e) => form.extras[e.id])
                .map((e) => e.label)
                .join(", ") || "žádné"
            }
          </div>

          <div class="section">
            AirTag: ${form.airtag ? "ANO" : "NE"}
          </div>

          <div class="section" style="font-size: 12px;">
            Zákazník souhlasí se zpracováním osobních údajů.
          </div>

          <div class="section">
            Podpis: ________________________
          </div>

        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return alert("Povol popup okna");

    win.document.write(content);
win.document.close();

win.onload = () => {
  setTimeout(() => {
    win.focus();
    win.print();
  }, 800);
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

      <input
        name="idNumber"
        placeholder="Číslo dokladu"
        onChange={handleChange}
      />

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

      <select
        value={form.frame}
        onChange={(e) => setForm({ ...form, frame: e.target.value })}
      >
        {(BIKES.find((b) => b.name === form.bike)?.frames || []).map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <h3>Celkem: {total} Kč</h3>

      <h3>Doplňky</h3>
      {EXTRAS.map((e) => (
        <div key={e.id}>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleExtra(e.id)}
            />
            {e.label}
          </label>
        </div>
      ))}

      <label>
        <input
          type="checkbox"
          name="airtag"
          checked={form.airtag}
          onChange={handleChange}
        />
        AirTag
      </label>

      <br /><br />

      <button onClick={printContract}>
        Vytisknout smlouvu
      </button>
    </div>
  );
}
