import { useState } from "react";

const BIKES = [
  "Rock Machine Gravelride 500",
  "CTM Koyuk 3.0 2024",
  "Pells RAW 3 2025",
  "Rock Machine Lukk CR 90 2025"
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

      <select name="bike" onChange={handleChange}>
        {BIKES.map(b => <option key={b}>{b}</option>)}
      </select><br/><br/>

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
