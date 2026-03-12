import TopNav from "../components/TopNavBar";

export default function ReportsPage() {

  const alerts = [
    {
      id: 1,
      level: "critical",
      message: "3 nurses hit the panic button",
      time: "2 minutes ago",
    },
    {
      id: 2,
      level: "warning",
      message: "Heart monitor 1 sat in storage for 6 hours",
      time: "15 minutes ago",
    },
    {
      id: 3,
      level: "info",
      message: "Stretcher 1 was used 300% more than stretcher 2 today",
      time: "1 hour ago",
    },
    {
      id: 4,
      level: "critical",
      message: "Crash cart missing",
      time: "5 hours ago",
    },
  ];

  const severityStyles = {
    critical: "bg-red-100 border-red-500 text-red-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  const counts = {
    critical: alerts.filter(a => a.level === "critical").length,
    warning: alerts.filter(a => a.level === "warning").length,
    info: alerts.filter(a => a.level === "info").length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav />

      <main className="p-6 max-w-6xl mx-auto w-full">

        <h1 className="text-2xl font-semibold mb-6">Today's summary:</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white shadow rounded-lg p-5 border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Critical Alerts</p>
            <p className="text-3xl font-bold text-red-600">{counts.critical}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Warnings</p>
            <p className="text-3xl font-bold text-yellow-600">{counts.warning}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Info</p>
            <p className="text-3xl font-bold text-blue-600">{counts.info}</p>
          </div>

        </div>

        {/* Alert List */}
        <div className="bg-white rounded-lg shadow p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Alerts
          </h2>

          <div className="space-y-3">

            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 rounded-md ${severityStyles[alert.level]}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {alert.message}
                  </span>

                  <span className="text-sm opacity-70">
                    {alert.time}
                  </span>
                </div>
              </div>
            ))}

          </div>

        </div>

      </main>
    </div>
  );
}