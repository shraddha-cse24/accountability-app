import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupHistory, clearHistory, } from "../services/groupDetailsService";

function GroupHistoryPage() {

    const { groupId } = useParams();
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState("7");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [filter]);

    const fetchHistory = async () => {
        try {

            setLoading(true);

            const data =
                await getGroupHistory(
                    groupId,
                    filter
                );

            setHistory(data.history);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const handleClearHistory =
        async () => {

            const confirmDelete =
                window.confirm(
                    "Delete all historical goals?"
                );

            if (!confirmDelete) return;

            try {

                await clearHistory(groupId);

                await fetchHistory();

            } catch (error) {

                console.error(error);
            }
        };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-6">

                    <div className="flex items-center gap-3 mb-3">

                        <button
                            onClick={() =>
                                navigate(`/group/${groupId}`)
                            }
                            className="text-slate-500 hover:text-rose-600 transition"
                        >
                            ← Back
                        </button>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
                            History
                        </h1>

                    </div>

                    <p className="text-slate-500">
                        Review previous goals and progress.
                    </p>

                </div>

                <div className="flex gap-3 items-center mb-6">

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-rose-200 rounded-xl bg-white"
                    >
                        <option value="7">
                            Last 7 Days
                        </option>

                        <option value="30">
                            Last 30 Days
                        </option>

                        <option value="90">
                            Last 90 Days
                        </option>

                        <option value="all">
                            All Time
                        </option>

                    </select>

                    <button
                        onClick={handleClearHistory}
                        className="px-4 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
                    >
                        🗑
                    </button>

                </div>

                {/* History Cards */}
                {loading ? (

                    <div className="text-center py-16 text-slate-500">
                        Loading...
                    </div>

                ) : history.length === 0 ? (

                    <div className="bg-white rounded-3xl p-12 shadow-md border border-rose-100 text-center">

                        <div className="text-6xl mb-4">
                            📭
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            No History Found
                        </h2>

                        <p className="text-slate-500 mt-2">
                            No goals exist for the selected period.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {history.map((goal) => (

                            <div
                                key={goal.id}
                                className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >

                                <div className="flex justify-between items-start gap-4">

                                    <div>

                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {goal.title}
                                        </h3>

                                        <p className="text-slate-500 mt-1">
                                            Created by {goal.user_name}
                                        </p>

                                    </div>

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${goal.status === "VERIFIED"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : goal.status === "MISSED"
                                                ? "bg-rose-100 text-rose-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {goal.status}
                                    </span>

                                </div>

                                <div className="flex flex-wrap gap-3 mt-5">

                                    <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-sm">
                                        📅 {
                                            new Date(
                                                goal.goal_date
                                            ).toLocaleDateString()
                                        }
                                    </span>

                                </div>

                                <div className="mt-5">

                                    {goal.proof_url ? (

                                        <a
                                            href={goal.proof_url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={goal.proof_url}
                                                alt="Proof"
                                                className="w-56 rounded-2xl border border-rose-100 hover:shadow-lg hover:scale-[1.02] transition"
                                            />
                                        </a>

                                    ) : (

                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm">
                                            📄 Proof not available
                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default GroupHistoryPage;