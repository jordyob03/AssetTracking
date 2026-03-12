import { useEffect, useState } from "react";
import TopNav from "../components/TopNavBar";

export default function AssetPage() {
  const [assetTypes, setAssetTypes] = useState({});

  useEffect(() => {
    async function loadTypes() {
      const res = await fetch("/asset-types.json");
      const data = await res.json();
      setAssetTypes(data);
    }

    loadTypes();
  }, []);

  const handleColorChange = (type, newColor) => {
    setAssetTypes((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        color: newColor,
      },
    }));
  };

  const saveChanges = () => {
    console.log("Updated asset types:", assetTypes);
    alert("Saved locally (backend save not implemented yet)");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />

      <main className="p-6 max-w-4xl mx-auto w-full">

        <h1 className="text-2xl font-semibold mb-6">
          Asset Type Settings
        </h1>

        <div className="bg-white shadow rounded-lg p-4">

          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-3">Asset Type</th>
                <th>Preview</th>
                <th>Color</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(assetTypes).map(([type, data]) => (
                <tr key={type} className="border-b">

                  {/* Name */}
                  <td className="py-3 font-medium">
                    {data.label}
                  </td>

                  {/* Color Preview */}
                  <td>
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ background: data.color }}
                    />
                  </td>

                  {/* Color Picker */}
                  <td>
                    <input
                      type="color"
                      value={data.color}
                      onChange={(e) =>
                        handleColorChange(type, e.target.value)
                      }
                      className="cursor-pointer"
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={saveChanges}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

      </main>
    </div>
  );
}