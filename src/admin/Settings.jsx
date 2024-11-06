import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Settings() {
  const [portalOpen, setPortalOpen] = useState(new Date());
  const [portalClose, setPortalClose] = useState(new Date());
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/settings.php`);
        const data = await response.json();
        setPortalOpen(new Date(data.portal_open));
        setPortalClose(new Date(data.portal_close));
        setShowResults(data.show_results === 1);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portal_open: portalOpen.toISOString(),
          portal_close: portalClose.toISOString(),
          show_results: showResults ? 1 : 0,
        }),
      });
      const result = await response.json();
      alert(result.success ? "Settings updated successfully." : "Failed to update settings.");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Portal Open Time */}
      <SettingItem
        label="Portal Open Time"
        component={
          <DatePicker
            selected={portalOpen}
            onChange={(date) => setPortalOpen(date)}
            showTimeSelect
            dateFormat="Pp"
            className="border p-2 rounded"
          />
        }
      />

      {/* Portal Close Time */}
      <SettingItem
        label="Portal Close Time"
        component={
          <DatePicker
            selected={portalClose}
            onChange={(date) => setPortalClose(date)}
            showTimeSelect
            dateFormat="Pp"
            className="border p-2 rounded"
          />
        }
      />

      {/* Toggle to Show/Hide Vote Results */}
      <SettingToggle
        label="Display Vote Results:"
        isChecked={showResults}
        onToggle={() => setShowResults((prev) => !prev)}
      />

      {/* Save Button */}
      <button
        onClick={updateSettings}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}

/**
 * Functional component for a settings item with a label and custom component.
 */
const SettingItem = ({ label, component }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">{label}</h3>
    {component}
  </div>
);

/**
 * Functional component for a toggle setting with a label.
 */
const SettingToggle = ({ label, isChecked, onToggle }) => (
  <div className="flex items-center space-x-4">
    <label className="text-lg font-semibold">{label}</label>
    <div className="relative">
      <input type="checkbox" checked={isChecked} onChange={onToggle} className="sr-only" />
      <div
        className={`block w-10 h-6 rounded-full cursor-pointer ${isChecked ? "bg-green-500" : "bg-gray-300"}`}
        onClick={onToggle}
      />
      <div
        className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${isChecked ? "transform translate-x-4" : ""}`}
      />
    </div>
  </div>
);

export default Settings;
