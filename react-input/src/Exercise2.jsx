import { useState } from "react";

const Exercise2 = () => {
  const [name, setName] = useState("");
  const [fruit, setFruit] = useState("");

  const handleSelect = (e) => {
    setFruit(e.target.value);
    console.log(`${name} selected ${e.target.value}`);
  };

  return (
    <div>
      <input
        id="name-input"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <select
        id="select-input"
        onChange={handleSelect}
        value={fruit}
      >
        <option value="">-pick a fruit-</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
      </select>
    </div>
  );
};
export default Exercise2;