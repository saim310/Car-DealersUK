"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelectDropdown({
  options = [],
  selectedValues = [],
  onChange = () => {},
  placeholder = "Select Options",
  label = "",
  addtionalParentClass = "",
}) {
  const selectRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filter out dummy "Any ..." or "All ..." options from selectable list
  const selectableOptions = options.filter(
    (opt) => opt && !String(opt).startsWith("Any ") && !String(opt).startsWith("All ")
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (opt) => {
    let updated;
    if (selectedValues.includes(opt)) {
      updated = selectedValues.filter((v) => v !== opt);
    } else {
      updated = [...selectedValues, opt];
    }
    onChange(updated);
  };

  const handleSelectAll = () => {
    onChange([...selectableOptions]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  // Determine trigger text
  let labelText = placeholder;
  if (selectedValues.length === 0) {
    labelText = placeholder;
  } else if (selectedValues.length === 1) {
    labelText = selectedValues[0];
  } else if (selectedValues.length === 2) {
    labelText = selectedValues.join(", ");
  } else {
    const categoryName = label || "Selected";
    labelText = `${categoryName} (${selectedValues.length})`;
  }

  return (
    <>
      <style>{`
        .multi-select-dropdown {
          position: relative;
          user-select: none;
          width: 100%;
        }
        .multi-select-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #fff;
          border: 1px solid #e4e4e4;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #111;
          height: 48px;
        }
        .multi-select-trigger .trigger-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        .multi-select-trigger .arrow-icon {
          transition: transform 0.2s ease;
          font-size: 12px;
          color: #666;
          margin-left: 8px;
        }
        .multi-select-dropdown.open .arrow-icon {
          transform: rotate(180deg);
        }
        .multi-select-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 100;
          background: #fff;
          border: 1px solid #e4e4e4;
          border-radius: 6px;
          margin-top: 4px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          max-height: 260px;
          display: flex;
          flex-direction: column;
        }
        .multi-select-actions {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          background: #f9f9f9;
        }
        .multi-select-actions button {
          background: none;
          border: none;
          color: #ff7101;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 2px 4px;
        }
        .multi-select-actions button:hover {
          text-decoration: underline;
        }
        .multi-select-options-list {
          overflow-y: auto;
          padding: 6px 0;
          margin: 0;
          list-style: none;
        }
        .multi-select-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
          color: #333;
          width: 100%;
          margin: 0;
          user-select: none;
          box-sizing: border-box;
        }
        .multi-select-item:hover {
          background: #f5f5f5;
        }
        .multi-select-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #ff7101;
          cursor: pointer;
          margin: 0;
          flex-shrink: 0;
          pointer-events: auto;
        }
        .multi-select-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          pointer-events: auto;
        }
      `}</style>

      <div
        className={`multi-select-dropdown ${addtionalParentClass} ${
          isOpen ? "open" : ""
        }`}
        ref={selectRef}
      >
        <div className="multi-select-trigger" onClick={toggleDropdown}>
          <span className="trigger-text">{labelText}</span>
          <span className="arrow-icon">▼</span>
        </div>

        {isOpen && (
          <div className="multi-select-menu">
            <div className="multi-select-actions">
              <button type="button" onClick={handleSelectAll}>
                Select All
              </button>
              <button type="button" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
            <ul className="multi-select-options-list">
              {selectableOptions.length === 0 ? (
                <li style={{ padding: "8px 12px", color: "#888", fontSize: "14px" }}>
                  No options available
                </li>
              ) : (
                selectableOptions.map((opt, idx) => {
                  const isChecked = selectedValues.includes(opt);
                  return (
                    <li key={idx}>
                      <label className="multi-select-item">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(opt)}
                        />
                        <span className="multi-select-text">{opt}</span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}


