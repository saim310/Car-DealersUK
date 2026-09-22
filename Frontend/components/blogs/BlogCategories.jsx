"use client";
import { useEffect, useState } from "react";

export default function BlogCategories({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://apis.ukaautotrade.co.uk/api/blogs/categories");
        const data = await res.json();
        if (res.ok && data) {
          setCategories(data.categories || []);
          setError(null);
        } else {
          console.error("Failed to fetch categories:", data.message || "Unknown error");
          setError(data.message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error fetching categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryTitle) => {
    if (onCategorySelect) {
      onCategorySelect(categoryTitle);
    }
  };

  const handleClearFilter = () => {
    if (onCategorySelect) {
      onCategorySelect(null);
    }
  };

  return (
    <div className="widget widget-categories style">
      <h3 className="widget-titles title-categories">Categories</h3>
      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : categories.length > 0 ? (
        <ul>
          {selectedCategory && (
            <li className="flex-two">
              <button
                onClick={handleClearFilter}
                className="font-2 fw-7"
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF7101",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear Filter
              </button>
            </li>
          )}
          {categories.map((category, index) => (
            <li
              key={index}
              className="flex-two"
              style={{
                backgroundColor:
                  selectedCategory === category.title ? "#f0f0f0" : "transparent",
                padding: "5px 0",
                borderRadius: "3px",
              }}
            >
              <button
                onClick={() => handleCategoryClick(category.title)}
                className="font-2 fw-7"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color:
                    selectedCategory === category.title ? "#FF7101" : "inherit",
                  fontWeight:
                    selectedCategory === category.title ? "bold" : "normal",
                }}
              >
                {category.title}
              </button>
              <div className="number">({category.count})</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}
