import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">

            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white font-bold">
                        C
                    </div>

                    <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-700 to-fuchsia-700 bg-clip-text text-transparent">
                        Commitly
                    </h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-3 sm:px-5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
                    >
                        Sign In
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="px-3 sm:pax-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white hover:shadow-lg transition"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">

                <div className="text-center max-w-4xl mx-auto">

                    <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                        Accountability Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-slate-900">
                        Turn Goals Into
                        <span className="block bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
                            Commitments
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 mt-8 leading-relaxed">
                        Create goals, upload proof of completion,
                        and let friends verify your progress.
                        Stay accountable and achieve more together.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

                        <button
                            onClick={() => navigate("/register")}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition"
                        >
                            Get Started Free
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-4 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 transition"
                        >
                            Sign In
                        </button>

                    </div>
                </div>
            </section>


            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-20">

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900">
                        Why Commitly?
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Accountability works better when you're not alone.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white rounded-3xl p-8 shadow-md border border-rose-100">
                        <div className="text-5xl mb-5">
                            🎯
                        </div>

                        <h3 className="text-2xl font-semibold mb-3">
                            Set Goals
                        </h3>

                        <p className="text-slate-600">
                            Create personal goals and track your progress every day.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-md border border-rose-100">
                        <div className="text-5xl mb-5">
                            📸
                        </div>

                        <h3 className="text-2xl font-semibold mb-3">
                            Upload Proof
                        </h3>

                        <p className="text-slate-600">
                            Share evidence of completion instead of simply marking goals done.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-md border border-rose-100">
                        <div className="text-5xl mb-5">
                            🤝
                        </div>

                        <h3 className="text-2xl font-semibold mb-3">
                            Get Verified
                        </h3>

                        <p className="text-slate-600">
                            Friends verify your achievements and keep you accountable.
                        </p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-md border border-orange-100">
                        <div className="text-5xl mb-5">
                            🔥
                        </div>

                        <h3 className="text-2xl font-semibold mb-3">
                            Build Streaks
                        </h3>

                        <p className="text-slate-600">
                            Stay consistent and maintain your daily accountability streak.
                        </p>
                    </div>

                </div>
            </section>

            {/* How it works */}
            <section className="max-w-7xl mx-auto px-6 py-20">

                <div className="bg-white rounded-[40px] p-10 shadow-lg border border-rose-100">

                    <h2 className="text-4xl font-bold text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">

                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4">
                                1
                            </div>

                            <h3 className="font-semibold mb-2">
                                Create Group
                            </h3>

                            <p className="text-sm text-slate-500">
                                Start an accountability group.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4">
                                2
                            </div>

                            <h3 className="font-semibold mb-2">
                                Add Friends
                            </h3>

                            <p className="text-sm text-slate-500">
                                Invite people who will keep you accountable.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4">
                                3
                            </div>

                            <h3 className="font-semibold mb-2">
                                Complete Goals
                            </h3>

                            <p className="text-sm text-slate-500">
                                Finish tasks and upload proof.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-4">
                                4
                            </div>

                            <h3 className="font-semibold mb-2">
                                Get Verified
                            </h3>

                            <p className="text-sm text-slate-500">
                                Earn trust through peer verification.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-5xl mx-auto px-6 py-20">

                <div className="text-center bg-gradient-to-r from-rose-600 to-fuchsia-700 rounded-[40px] p-12 text-white">

                    <h2 className="text-4xl font-bold mb-4">
                        Ready to stay accountable?
                    </h2>

                    <p className="text-lg opacity-90 mb-8">
                        Join Commitly and turn your goals into real achievements.
                    </p>

                    <button
                        onClick={() => navigate("/register")}
                        className="bg-white text-rose-700 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
                    >
                        Create Free Account
                    </button>

                </div>

            </section>

        </div>
        
    );
}