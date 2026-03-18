import React, { useState } from "react";

export default function AssetDirectory({
  assets = [],
  floorData,
  assetTypes = {},
  visibleTypes,
  setVisibleTypes
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

  const toggleVisibility = (type) => {
    setVisibleTypes((prev) => ({
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

            const available = typeAssets.filter(a => !a.inUse);
            const inUse = typeAssets.filter(a => a.inUse);

            const isNurse = type === "nurse";

            return (
              <div key={type} className="border rounded-md p-2">

                <button
                  onClick={() => toggleType(type)}
                  className="w-full text-left bg-gray-100 hover:bg-gray-200 font-medium flex justify-between items-center p-2 rounded"
                >
                  <div className="flex items-center gap-2">

                    <input
                      type="checkbox"
                      checked={visibleTypes[type] ?? true}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleVisibility(type);
                      }}
                    />

                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          assetTypes[type]?.color || "gray",
                      }}
                    />

                    <span>
                      {assetTypes[type]?.label || type} ({typeAssets.length})
                    </span>

                  </div>

                  <span>{openTypes[type] ? "−" : "+"}</span>
                </button>

                {openTypes[type] && (
                  <div className="p-2 space-y-2">

                    {/* Nurses just show normally */}
                    {isNurse && (
                      <ul className="space-y-1">
                        {typeAssets.map((a) => (
                          <li
                            key={a.id}
                            className="p-1 bg-gray-50 rounded border"
                          >
                            {a.name} (Room: {getRoomName(a.roomId)})
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Other asset types show Available / In Use */}
                    {!isNurse && (
                      <>
                        {available.length > 0 && (
                          <div className="mb-2">
                            <div className="text-sm font-semibold text-green-700 mb-1">
                              Available
                            </div>

                            <ul className="space-y-1">
                              {available.map((a) => (
                                <li
                                  key={a.id}
                                  className="p-1 bg-green-50 rounded border"
                                >
                                  {a.name} (Room: {getRoomName(a.roomId)})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {inUse.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-red-700 mb-1">
                              In Use
                            </div>

                            <ul className="space-y-1">
                              {inUse.map((a) => (
                                <li
                                  key={a.id}
                                  className="p-1 bg-red-50 rounded border"
                                >
                                  {a.name} (Room: {getRoomName(a.roomId)})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}