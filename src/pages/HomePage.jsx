import { useState, useEffect } from "react";

const HomePage = () => {
  const todayKey = "waterIntake-" + new Date().toDateString();
  const goalKey = "dailyGoal";

  const [dailyGoal, setDailyGoal] = useState(() => {
    const savedGoal = localStorage.getItem(goalKey);
    return savedGoal ? parseInt(savedGoal) : 2000;
  });

  const [waterTotal, setWaterTotal] = useState(() => {
    const saved = localStorage.getItem(todayKey);
    return saved ? parseInt(saved) : 0;
  });

  const [inputValue, setInputValue] = useState("");
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [history, setHistory] = useState([]); 

  useEffect(() => {
    localStorage.setItem(todayKey, waterTotal);
  }, [waterTotal, todayKey]);

  useEffect(() => {
    const entries = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("waterIntake-")) {
        const date = key.replace("waterIntake-", "");
        const amount = parseInt(localStorage.getItem(key)) || 0;
        entries.push({ date, amount });
      }
    }

    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistory(entries);
  }, [waterTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(inputValue);
    if (!amount || amount <= 0) return;
    setWaterTotal((prev) => prev + amount);
    setInputValue("");
  };

  const handleGoalUpdate = (e) => {
    e.preventDefault();
    const newGoal = parseInt(goalInput);
    if (!newGoal || newGoal <= 0) return;
    setDailyGoal(newGoal);
    localStorage.setItem(goalKey, newGoal);
  };

  const handleReset = () => {
    setWaterTotal(0);
  };

  const progressPercent = Math.min((waterTotal / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Water Intake Tracker</h1>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Enter amount (ml)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>

        <div className="mt-6">
          <p className="text-lg">
            Progress: {waterTotal} / {dailyGoal} ml ({Math.floor(progressPercent)}%)
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Today
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <form onSubmit={handleGoalUpdate} className="flex items-center gap-2">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Set daily goal (ml)"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Goal
            </button>
          </form>
        </div>

    
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Hydration History</h2>
          {history.length === 0 && <p>No hydration history found.</p>}
          <ul className="max-h-48 overflow-auto border border-gray-300 rounded p-2 bg-gray-50">
            {history.map(({ date, amount }) => (
              <li key={date} className="flex justify-between py-1 border-b border-gray-200 last:border-none">
                <span>{date}</span>
                <span>{amount} ml</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
