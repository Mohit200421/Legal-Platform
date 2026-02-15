import { useEffect, useState } from "react";
import { fetchCategories } from "@/api/lawyerApi";

export default function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await fetchCategories();
      setCategories(data.data);
    };
    loadCategories();
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Category</option>

      {categories.map((cat) => (
        <option key={cat._id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
