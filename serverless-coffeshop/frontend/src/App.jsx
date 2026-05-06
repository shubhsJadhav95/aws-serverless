import { useEffect, useState } from "react";
import { fetchCoffees, createCoffee } from "./utils/apis";
import { useNavigate, Routes, Route } from "react-router-dom";
import ItemDetails from "./ItemDetails";
import "./App.css";

// Mock auth object for development without Cognito
const mockAuth = {
  isLoading: false,
  error: null,
  isAuthenticated: true,
  user: {
    profile: {
      email: "dev@example.com"
    }
  }
};

function iconFor(name = "") {
  const n = name.toLowerCase();
  if (n.includes("latte") || n.includes("flat")) return "🥛";
  if (n.includes("mocha") || n.includes("choc")) return "🍫";
  if (n.includes("matcha") || n.includes("green")) return "🍵";
  if (n.includes("chai") || n.includes("tea")) return "🫖";
  if (n.includes("cold") || n.includes("iced") || n.includes("bubble")) return "🧋";
  return "☕";
}

const Toast = ({ message, visible }) => (
  <div className={`vg-toast ${visible ? "vg-toast--show" : ""}`}>
    <span className="vg-toast__icon">✓</span>
    <span>{message}</span>
  </div>
);

const CoffeeCard = ({ coffee, onClick, onDelete }) => (
  <div className="vg-card" onClick={onClick}>
    <button
      className="vg-card__delete"
      onClick={(e) => { e.stopPropagation(); onDelete(coffee.coffeeId); }}
      aria-label="Remove item"
    >
      ✕
    </button>
    <span className="vg-card__icon">{iconFor(coffee.name)}</span>
    <h3 className="vg-card__name">{coffee.name}</h3>
    <p className="vg-card__price">
      ${Number(coffee.price).toFixed(2)} <span>/ cup</span>
    </p>
    <span className={`vg-badge ${coffee.available ? "vg-badge--avail" : "vg-badge--out"}`}>
      <span className="vg-badge__dot" />
      {coffee.available ? "Available" : "Sold out"}
    </span>
  </div>
);

const HomeView = ({ auth, signOutRedirect }) => {
  const [coffees, setCoffees] = useState([]);
  const [coffeeId, setCoffeeId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoffees().then((data) => setCoffees(data.Items || []));
  }, []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2500);
  };

  const validate = () => {
    const e = {};
    if (!coffeeId.trim()) e.coffeeId = true;
    if (!name.trim()) e.name = true;
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddCoffee = async () => {
    if (!validate()) return;
    const newCoffee = { coffeeId, name, price: Number(price), available };
    await createCoffee(newCoffee);
    setCoffees((prev) => [...prev, newCoffee]);
    setCoffeeId("");
    setName("");
    setPrice("");
    setAvailable(true);
    setErrors({});
    showToast(`"${name}" added to menu`);
  };

  const handleDelete = (id) => {
    setCoffees((prev) => prev.filter((c) => c.coffeeId !== id));
    showToast("Item removed from menu");
  };

  const filtered = coffees.filter((c) => {
    if (filter === "available") return c.available;
    if (filter === "unavailable") return !c.available;
    return true;
  });

  return (
    <div className="vg-wrap">
      {/* Header */}
      <header className="vg-header">
        <div className="vg-logo">
          <span className="vg-logo__dot" />
          Velvet Grounds
        </div>
        <nav className="vg-nav">
          <button className="vg-nav__btn vg-nav__btn--active">Menu</button>
          <button className="vg-nav__btn">Orders</button>
          <button className="vg-nav__btn">Analytics</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {auth.user?.profile.email}
            </span>
            <button className="vg-nav__btn" onClick={signOutRedirect}>
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      <div className="vg-body">
        {/* Sidebar form */}
        <aside className="vg-sidebar">
          <p className="vg-sidebar__title">Add to Menu</p>

          <div className="vg-field">
            <label className="vg-label">Item ID</label>
            <input
              className={`vg-input ${errors.coffeeId ? "vg-input--error" : ""}`}
              type="text"
              placeholder="e.g. ESP-001"
              value={coffeeId}
              onChange={(e) => setCoffeeId(e.target.value)}
            />
          </div>

          <div className="vg-field">
            <label className="vg-label">Drink Name</label>
            <input
              className={`vg-input ${errors.name ? "vg-input--error" : ""}`}
              type="text"
              placeholder="e.g. Oat Flat White"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="vg-field">
            <label className="vg-label">Price ($)</label>
            <input
              className={`vg-input ${errors.price ? "vg-input--error" : ""}`}
              type="number"
              placeholder="4.50"
              min="0"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="vg-toggle-row">
            <span className="vg-toggle-row__label">Available now</span>
            <label className="vg-toggle">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <span className="vg-toggle__slider" />
            </label>
          </div>

          <hr className="vg-divider" />

          <button className="vg-add-btn" onClick={handleAddCoffee}>
            + Add to Menu
          </button>
        </aside>

        {/* Main grid */}
        <main className="vg-main">
          <div className="vg-main__header">
            <h1 className="vg-main__title">
              Our <em>Coffees</em>
            </h1>
            <span className="vg-count">
              {coffees.length} item{coffees.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="vg-filters">
            {["all", "available", "unavailable"].map((f) => (
              <button
                key={f}
                className={`vg-chip ${filter === f ? "vg-chip--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="vg-grid">
            {filtered.length === 0 ? (
              <div className="vg-empty">
                <div className="vg-empty__icon">☕</div>
                <p className="vg-empty__text">
                  {coffees.length === 0
                    ? "Your menu is empty — add your first coffee."
                    : "No items match this filter."}
                </p>
              </div>
            ) : (
              filtered.map((coffee) => (
                <CoffeeCard
                  key={coffee.coffeeId}
                  coffee={coffee}
                  onClick={() => navigate(`/details/${coffee.coffeeId}`)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

const App = () => {
  const auth = mockAuth;

  const signOutRedirect = () => {
    // Mock sign out - just reload the page
    window.location.reload();
  };

  
  return (
    <Routes>
      <Route path="/" element={<HomeView auth={auth} signOutRedirect={signOutRedirect} />} />
      <Route path="/details/:id" element={<ItemDetails auth={auth} signOutRedirect={signOutRedirect} />} />
    </Routes>
  );
};

export default App;