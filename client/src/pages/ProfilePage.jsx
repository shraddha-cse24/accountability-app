import { useEffect, useState } from "react";
import { getProfile, updateProfile, } from "../services/profileService";
import { getMyStreak }
    from "../services/statsService";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();

    const [profile, setProfile] =
        useState(null);
    const [name, setName] =
        useState("");
        
    const [streak, setStreak] =
        useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile =
        async () => {
            try {

                const data =
                    await getProfile();

                setProfile(data);
                setName(
                    data.user.name
                );

                const streakData =
                    await getMyStreak();

                setStreak(streakData);

            } catch (error) {
                console.error(error);
            }
        };

    if (!profile) {
        return <h1>Loading...</h1>;
    }

    const achievements = [
        {
            title: "🔥 Fire Starter",
            description: "Reach a 3 day streak",
            current:
                streak?.currentStreak || 0,
            target: 3,
        },
        {
            title: "⚡ Unstoppable",
            description: "Reach a 7 day streak",
            current:
                streak?.currentStreak || 0,
            target: 7,
        },
        {
            title: "🚀 Discipline Machine",
            description: "Reach a 15 day streak",
            current:
                streak?.currentStreak || 0,
            target: 15,
        },
        {
            title: "💠 Diamond Will",
            description: "Reach a 60 day streak",
            current: streak?.currentStreak || 0,
            target: 60,
        },
        {
            title: "☄️ Iron Mind",
            description: "Reach a 100 day streak",
            current:
                streak?.currentStreak || 0,
            target: 100,
        },
        {
            title: "👑 Discipline Legend",
            description: "Reach a 180 day streak",
            current:
                streak?.currentStreak || 0,
            target: 180,
        },
    ];

    achievements.forEach((achievement) => {

        achievement.unlocked =
            achievement.current >=
            achievement.target;

        achievement.progress =
            Math.min(
                (achievement.current /
                    achievement.target) *
                100,
                100
            );

    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="bg-white rounded-3xl p-8 shadow-md border border-rose-100 mb-8">
                    <div className="flex justify-end mb-4">

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-100 transition"
                        >
                            ← Back
                        </button>

                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-6">

                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {profile.user.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
                                Commitly Profile
                            </div>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                className="w-full mt-3 px-4 py-3 border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />

                            <p className="text-slate-500 mt-2">
                                {profile.user.email}
                            </p>

                            <button
                                onClick={async () => {

                                    try {

                                        if (!name.trim()) {
                                            return alert(
                                                "Name is required"
                                            );
                                        }

                                        if (name.trim().length > 50) {
                                            return alert(
                                                "Name too long"
                                            );
                                        }

                                        await updateProfile(
                                            name
                                        );

                                        alert(
                                            "Profile Updated"
                                        );

                                        fetchProfile();

                                    } catch (error) {

                                        console.error(
                                            error
                                        );
                                    }
                                }}
                                className="mt-4 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-medium hover:shadow-lg transition"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

                    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
                        <p className="text-slate-500 text-sm font-medium mb-2">
                            Total Goals
                        </p>

                        <h2 className="text-4xl font-bold text-slate-900">
                            {profile.stats.totalGoals || 0}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition">
                        <p className="text-emerald-600 text-sm font-medium mb-2">
                            Completed
                        </p>

                        <h2 className="text-4xl font-bold text-emerald-700">
                            {profile.stats.completedGoals || 0}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl transition">
                        <p className="text-rose-600 text-sm font-medium mb-2">
                            Missed
                        </p>

                        <h2 className="text-4xl font-bold text-rose-700">
                            {profile.stats.missedGoals || 0}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-md border border-fuchsia-100 hover:shadow-xl transition">
                        <p className="text-fuchsia-600 text-sm font-medium mb-2">
                            Verified
                        </p>

                        <h2 className="text-4xl font-bold text-fuchsia-700">
                            {profile.stats.verifiedGoals || 0}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-100 hover:shadow-xl transition">
                        <p className="text-orange-600 text-sm font-medium mb-2">
                            Groups Joined
                        </p>

                        <h2 className="text-4xl font-bold text-orange-700">
                            {profile.groupsJoined}
                        </h2>
                    </div>

                </div>

                {/*Achievements*/}

                <div className="mt-10">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            🏆 Achievements
                        </h2>

                        <p className="text-slate-500 text-sm">
                            Unlock milestones through verified goals and streaks.
                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                        {achievements.map(
                            (achievement) => (

                                <div
                                    key={achievement.title}
                                    className={`rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${achievement.unlocked
                                        ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                                        : "bg-slate-100 border-slate-200 opacity-70"
                                        }`}
                                >

                                    <div className="flex justify-between items-start">


                                        <div>


                                            <h3 className="font-semibold text-xl text-slate-900">
                                                {achievement.title}
                                            </h3>

                                            <p className="text-slate-500 mt-1">
                                                {achievement.description}
                                            </p>

                                        </div>

                                        <span className="text-2xl">
                                            {achievement.unlocked
                                                ? "✨"
                                                : "🔒"}
                                        </span>

                                    </div>

                                    <div className="mt-4">

                                        <div className="w-full h-2 bg-slate-200 rounded-full">

                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600"
                                                style={{
                                                    width: `${achievement.progress}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                    <div className="flex justify-between items-center mt-4">

                                        <span className="text-sm font-medium text-slate-500">

                                            {achievement.current}
                                            {" / "}
                                            {achievement.target}

                                        </span>

                                        {achievement.unlocked ? (

                                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                                ✓ Unlocked
                                            </span>

                                        ) : (

                                            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-sm font-medium">
                                                🔒 Locked
                                            </span>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

                {/*  Banner */}
                <div className="mt-8 bg-gradient-to-r from-rose-600 to-fuchsia-700 rounded-3xl p-8 text-white shadow-lg">

                    <h2 className="text-2xl font-bold mb-2">
                        Keep Building Momentum 🚀
                    </h2>

                    <p className="opacity-90">
                        Every completed and verified goal brings you one step closer
                        to becoming the person you want to be.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default ProfilePage;