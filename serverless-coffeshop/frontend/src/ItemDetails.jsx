import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoffee, updateCoffee, deleteCoffee } from "./utils/apis";
import "./ItemDetails.css";

function iconFor(name = "") {
  const n = name.toLowerCase();
  if (n.includes("latte") || n.includes("flat")) return "🥛";
  if (n.includes("mocha") || n.includes("choc")) return "🍫";
  if (n.includes("matcha") || n.includes("green")) return "🍵";
  if (n.includes("chai") || n.includes("tea")) return "🫖";
  if (n.includes("cold") || n.includes("iced") || n.includes("bubble")) return "🧋";
  return "☕";
}

const ItemDetails = ({ auth, signOutRedirect }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coffee, setCoffee] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getCoffee(id).then((data) => {
      setCoffee(data.Item);
      setDraft(data.Item);
    });
  }, [id]);

  const handleEdit = () => {
    setDraft({ ...coffee });
    setEditMode(true);
  };

  const handleCancel = () => {
    setDraft({ ...coffee });
    setEditMode(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    await updateCoffee(id, draft);
    setCoffee(draft);
    setEditMode(false);
    setSaving(false);
  };

  const handleDelete = async () => {
    await deleteCoffee(id);
    navigate("/");
  };

  if (!coffee) return (
    <div className="vg-wrap">
      <header className="vg-header">
        <div className="vg-logo"><span className="vg-logo__dot" />Velvet Grounds</div>
      </header>
      <div className="id-loading">
        <span className="id-loading__icon">☕</span>
        <p>Loading…</p>
      </div>
    </div>
  );

  const display = editMode ? draft : coffee;

  return (
    <div className="vg-wrap">
      {/* Header — reuses App.css tokens */}
      <header className="vg-header">
        <div className="vg-logo">
          <span className="vg-logo__dot" />
          Velvet Grounds
        </div>
        <button className="vg-nav__btn" onClick={() => navigate("/")}>
          ← Back to Menu
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {auth.user?.profile.email}
          </span>
          <button className="vg-nav__btn" onClick={signOutRedirect}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="id-body">
        {/* Left: visual panel */}
        <div className="id-visual">
          <div className="id-visual__icon">{iconFor(coffee.name)}</div>
          <p className="id-visual__id">ID: {coffee.coffeeId}</p>
          <span className={`vg-badge ${coffee.available ? "vg-badge--avail" : "vg-badge--out"}`}>
            <span className="vg-badge__dot" />
            {coffee.available ? "Available" : "Sold out"}
          </span>
        </div>

        {/* Right: detail / edit panel */}
        <div className="id-panel">
          <div className="id-panel__top">
            <div>
              <p className="id-panel__eyebrow">Coffee Detail</p>
              <h1 className="id-panel__title">
                {editMode ? <em>Editing</em> : coffee.name}
              </h1>
            </div>
            {!editMode && (
              <div className="id-panel__actions">
                <button className="id-btn id-btn--edit" onClick={handleEdit}>
                  Edit
                </button>
                <button className="id-btn id-btn--delete" onClick={() => setShowDeleteConfirm(true)}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <hr className="vg-divider" />

          {editMode ? (
            <div className="id-form">
              <div className="vg-field">
                <label className="vg-label">Coffee ID</label>
                <input
                  className="vg-input"
                  value={draft.coffeeId}
                  onChange={(e) => setDraft({ ...draft, coffeeId: e.target.value })}
                />
              </div>
              <div className="vg-field">
                <label className="vg-label">Drink Name</label>
                <input
                  className="vg-input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="vg-field">
                <label className="vg-label">Price ($)</label>
                <input
                  className="vg-input"
                  type="number"
                  value={draft.price}
                  min="0"
                  step="0.5"
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                />
              </div>
              <div className="vg-toggle-row">
                <span className="vg-toggle-row__label">Available now</span>
                <label className="vg-toggle">
                  <input
                    type="checkbox"
                    checked={draft.available}
                    onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                  />
                  <span className="vg-toggle__slider" />
                </label>
              </div>

              <div className="id-form__actions">
                <button className="id-btn id-btn--cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="id-btn id-btn--save" onClick={handleUpdate} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="id-meta">
              <div className="id-meta__row">
                <span className="id-meta__key">Price</span>
                <span className="id-meta__val id-meta__val--price">
                  ${Number(coffee.price).toFixed(2)}
                </span>
              </div>
              <div className="id-meta__row">
                <span className="id-meta__key">Status</span>
                <span className="id-meta__val">
                  {coffee.available ? "In stock" : "Sold out"}
                </span>
              </div>
              <div className="id-meta__row">
                <span className="id-meta__key">Item ID</span>
                <span className="id-meta__val id-meta__val--mono">{coffee.coffeeId}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="id-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="id-confirm" onClick={(e) => e.stopPropagation()}>
            <p className="id-confirm__icon">🗑️</p>
            <h2 className="id-confirm__title">Remove "{coffee.name}"?</h2>
            <p className="id-confirm__sub">This will permanently delete this item from your menu.</p>
            <div className="id-confirm__actions">
              <button className="id-btn id-btn--cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="id-btn id-btn--delete" onClick={handleDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;