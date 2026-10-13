export default function TabPanel({ tabs, activeTab, onChange }) {
    return (
      <div className="flex border-b pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }