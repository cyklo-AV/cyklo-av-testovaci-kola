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
  bike: BIKES[0],
  frame: "",
  price: 0,
  days: 1,
  deposit: 0,
  extras: {},
  airtag: false
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

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>cyklo-AV TESTovací kola</h1>

      <input placeholder="Jméno" name="name" onChange={handleChange} /><br/><br/>
      <input placeholder="Telefon" name="phone" onChange={handleChange} /><br/><br/>

      <select
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

      <input type="number" name="price" placeholder="Cena/den" onChange={handleChange} />
      <input type="number" name="days" placeholder="Dny" onChange={handleChange} />
      <input type="number" name="deposit" placeholder="Kauce" onChange={handleChange} />

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
        <input type="checkbox" name="airtag" onChange={handleChange} />
        Souhlas s AirTag
      </label>

      <h2>Celkem: {total} Kč</h2>
    </div>
  );
}
