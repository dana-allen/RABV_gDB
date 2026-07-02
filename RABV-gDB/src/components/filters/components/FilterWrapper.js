import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";


import 'assets/styles/filters.css';
export default function FilterWrapper({ label, selectedCount, reset, children }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [reset]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <Button
        size="sm"
        className={selectedCount ? "btn-filter-active" : "btn-filter"}
        onClick={() => setOpen(prev => !prev)}
      >
        {label}

        {selectedCount && (
          <span className="filter-count">
            {selectedCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="dropdown-box">
          <label
            style={{
              fontSize: "12px",
              fontWeight: "bold"
            }}
          >
            Find {label}
          </label>

          {children}
        </div>
      )}
    </div>
  );
}