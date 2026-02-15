import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ManageMaster() {
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newState, setNewState] = useState("");
  const [newCity, setNewCity] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [newCategory, setNewCategory] = useState("");


  // FETCH ALL STATES + CATEGORIES
  useEffect(() => {
    loadStates();
    loadCategories();
  }, []);

  const loadStates = async () => {
    const res = await API.get("/admin/master/state");
    setStates(res.data);
  };

  const loadCategories = async () => {
    const res = await API.get("/admin/master/category");
    setCategories(res.data);
  };

  const loadCities = async (stateId) => {
    const res = await API.get(`/admin/master/city/${stateId}`);
    setCities(res.data);
  };


  // ADD STATE
  const addState = async () => {
    if (!newState.trim()) return;
    await API.post("/admin/master/state", { name: newState });
    setNewState("");
    loadStates();
  };


  // ADD CITY
  const addCity = async () => {
    if (!newCity.trim() || !selectedState) return;

    await API.post("/admin/master/city", {
      name: newCity,
      stateId: selectedState
    });

    setNewCity("");
    loadCities(selectedState);
  };


  // ADD CATEGORY
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    await API.post("/admin/master/category", { name: newCategory });

    setNewCategory("");
    loadCategories();
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Cities / States / Categories</h1>

      <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
        
        {/* STATES */}
        <div>
          <h2>States</h2>

          <input
            placeholder="Add State"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            style={{ padding: "8px" }}
          />
          <button onClick={addState} style={{ marginLeft: "10px", padding: "8px" }}>
            Add
          </button>

          {/* Dropdown of states */}
          <select
            style={{ width: "200px", marginTop: "20px", padding: "8px" }}
            onChange={(e) => {
              setSelectedState(e.target.value);
              loadCities(e.target.value);
            }}
          >
            <option>Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>


        {/* CITIES */}
        <div>
          <h2>Cities</h2>

          <input
            placeholder="Add City"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            style={{ padding: "8px" }}
          />
          <button onClick={addCity} style={{ marginLeft: "10px", padding: "8px" }}>
            Add
          </button>

          {/* Show filtered cities */}
          <ul style={{ marginTop: "20px" }}>
            {cities.map((c) => (
              <li key={c._id}>{c.name}</li>
            ))}
          </ul>
        </div>


        {/* CATEGORIES */}
        <div>
          <h2>Categories</h2>

          <input
            placeholder="Add Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ padding: "8px" }}
          />
          <button onClick={addCategory} style={{ marginLeft: "10px", padding: "8px" }}>
            Add
          </button>

          <ul style={{ marginTop: "20px" }}>
            {categories.map((cat) => (
              <li key={cat._id}>{cat.name}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
