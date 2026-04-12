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
          Cena celkem: ${total} Kč<br/>
          Kauce: ${form.deposit} Kč
        </div>

<div class="section">
  <strong>QR platby:</strong><br/><br/>

  <table>
    <tr>
      <td>
        Zápůjčné:<br/>
        <img src="${generateQR(total, "Zapujcne")}" width="120"/>
      </td>
      <td style="padding-left: 20px;">
        Kauce:<br/>
        <img src="${generateQR(form.deposit, "Kauce")}" width="120"/>
      </td>
    </tr>
  </table>
</div>

        <div class="section">
          <strong>Doplňky:</strong><br/>
          ${
            EXTRAS
              .filter(e => form.extras[e.id])
              .map(e => e.label)
              .join(", ") || "žádné"
          }
        </div>

        <div class="section">
          AirTag sledování (souhlas zákazníka): ${form.airtag ? "ANO" : "NE"}
        </div>

       <br/><br/>

<div style="margin-top: 10px;">
  <div class="section" style="font-size: 12px;">
    Zákazník souhlasí se zpracováním osobních údajů za účelem evidence výpůjčky
    a ochrany majetku půjčitele.
  </div>

  <div class="section">
    Podpis zákazníka: ________________________
  </div>
</div>
      </body>
    </html>
  `;
  const win = window.open("", "_blank");
  if (!win) {
  alert("Povol popup okna pro tisk smlouvy");
    return;
}
  win.document.write(content);
  win.document.close();
  win.print();
}; 
const generateQR = (amount, message) => {
  const iban = "CZ4955000000000794545052"; // uprav na svůj účet

  const spayd = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*MSG:${message}`;

  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(spayd)}`;
};
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>cyklo-AV TESTovací kola</h1>

     <input placeholder="Jméno" name="name" onChange={handleChange} /><br/><br/>
<input placeholder="Telefon" name="phone" onChange={handleChange} /><br/><br/>

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

      <input type="number" value={form.price} readOnly />
<input type="number" value={form.deposit} readOnly />
<br /><br />
      
      <h3>Doplňky</h3>
      {EXTRAS.map(e => (
        <div key={e.id}>
          <label>
            <input type="checkbox" onChange={() => toggleExtra(e.id)} />
            {e.label} (+{e.price} Kč/den)
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
  Souhlas s AirTag
</label>

<br /><br />

      <h2>Celkem: {total} Kč</h2>
<h3>QR platby</h3>

<div>
  <div>Zápůjčné:</div>
  <img src={generateQR(total, "Zapůjčné kolo")} alt="QR zápůjčné" />
</div>

<br />

<div>
  <div>Kauce:</div>
  <img src={generateQR(form.deposit, "Kauce kolo")} alt="QR kauce" />
</div>
      
<br />
      
<button onClick={printContract}>
  Vytisknout smlouvu
</button>
    </div>
  );
}
