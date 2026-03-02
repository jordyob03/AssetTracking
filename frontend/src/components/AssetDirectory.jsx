import React, { useState } from "react";

export default function AssetDirectory({
  assets = [],
  floorData,
  assetTypes = {},
}) {
  const [openTypes, setOpenTypes] = useState({});

  const getRoomName = (roomId) => {
    const room = floorData?.rooms?.find((r) => r.id === roomId);
    return room ? room.name : "Unknown";
  };

  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {});

  const toggleType = (type) => {
    setOpenTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-4 h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Asset Directory
      </h3>

      {assets.length === 0 ? (
        <p className="text-gray-500">No active assets</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedAssets).map(([type, typeAssets]) => {
            const typeLabel =
              assetTypes[type]?.label || type;

            return (
              <div
                key={type}
                className="border rounded-md"
              >
                {/* Dropdown Header */}
                <button
                  onClick={() => toggleType(type)}
                  className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 font-medium flex justify-between items-center"
                >
                  <span>
                    {typeLabel} ({typeAssets.length})
                  </span>
                  <span>
                    {openTypes[type] ? "−" : "+"}
                  </span>
                </button>

                {openTypes[type] && (
                  <ul className="p-2 space-y-2">
                    {typeAssets.map((asset) => (
                      <li
                        key={asset.id}
                        className="p-2 bg-gray-50 rounded border hover:bg-gray-100 transition"
                      >
                        <div className="font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Room: {getRoomName(asset.roomId)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}