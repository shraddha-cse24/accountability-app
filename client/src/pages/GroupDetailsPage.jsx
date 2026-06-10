import { useEffect, useState } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import { getGroupDetails, addMember, removeMember, } from "../services/groupDetailsService";
import { createGoal, updateGoalStatus, verifyGoal, deleteGoal, } from "../services/goalService";
import { uploadProof } from "../services/proofService";
import {
    deleteGroup,
    leaveGroup,
} from "../services/groupService";

function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState(null);
    const [goalTitle, setGoalTitle] = useState("");

    const [memberEmail, setMemberEmail] = useState("");
    const [selectedFiles, setSelectedFiles] =
        useState({});

    const currentUserId =
        Number(localStorage.getItem("userId"));

    const currentMember =
        groupData?.members?.find(
            (member) =>
                member.id === currentUserId
        );

    const SERVER_URL =
        import.meta.env
            .VITE_SERVER_URL;

    const isOwner =
        currentMember?.role === "owner";

    useEffect(() => {
        fetchGroup();
    }, []);


    const fetchGroup = async () => {
        try {
            const data = await getGroupDetails(groupId);

            setGroupData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateGoal = async () => {
        try {
            if (!goalTitle.trim()) {
                return alert(
                    "Please enter a goal title"
                );
            }
            await createGoal(groupId, {
                title: goalTitle,
                goal_date:
                    new Date()
                        .toLocaleDateString(
                            "en-CA",
                            {
                                timeZone:
                                    "Asia/Kolkata",
                            }
                        ),
            });

            setGoalTitle("");

            fetchGroup();

        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async (
        goalId,
        status
    ) => {
        try {
            await updateGoalStatus(goalId, status);

            fetchGroup();
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyGoal = async (
        goalId
    ) => {
        try {
            await verifyGoal(goalId);

            fetchGroup();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteGoal = async (
        goalId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this goal?"
        );

        if (!confirmed) return;

        try {

            await deleteGoal(goalId);

            fetchGroup();

            alert("Goal deleted");

        } catch (error) {
            console.error(error);
        }
    };

    const handleUploadProof = async (
        goalId
    ) => {
        try {

            const selectedFile =
                selectedFiles[goalId];

            if (!selectedFile) {
                return alert(
                    "Please select a file"
                );
            }

            await uploadProof(
                goalId,
                selectedFile
            );

            fetchGroup();

            alert("Proof uploaded");

        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Upload failed"
            );
        }
    };

    const handleAddMember = async () => {
        if (!memberEmail.trim()) {
            return alert(
                "Email is required"
            );
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                memberEmail.trim()
            )
        ) {
            return alert(
                "Enter a valid email"
            );
        }
        try {

            await addMember(
                groupId,
                memberEmail
            );

            alert("Invitation sent");

            setMemberEmail("");

            fetchGroup();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to send invitation"
            );
        }
    };

    const handleRemoveMember = async (
        memberId
    ) => {

        const confirmed = window.confirm(
            "Remove this member from the group?"
        );

        if (!confirmed) return;

        try {

            await removeMember(
                groupId,
                memberId
            );

            fetchGroup();

            alert("Member removed");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to remove member"
            );
        }
    };

    const handleDeleteGroup =
        async () => {

            const confirmed =
                window.confirm(
                    "Delete this group permanently?"
                );

            if (!confirmed) return;

            try {

                await deleteGroup(
                    groupId
                );

                alert(
                    "Group deleted"
                );

                navigate(
                    "/dashboard"
                );

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Delete failed"
                );
            }
        };

    const handleLeaveGroup =
        async () => {

            const confirmed =
                window.confirm(
                    "Leave this group?"
                );

            if (!confirmed) return;

            try {

                await leaveGroup(
                    groupId
                );

                alert(
                    "You left the group"
                );

                navigate(
                    "/dashboard"
                );

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed"
                );
            }
        };

    if (!groupData) {
        return <h1>Loading...</h1>;
    }

    const today =
        new Date()
            .toLocaleDateString(
                "en-CA",
                {
                    timeZone:
                        "Asia/Kolkata",
                }
            );

    const todaysGoals =
        groupData.goals.filter(
            (goal) => {

                const goalDate =
                    new Date(
                        goal.goal_date
                    )
                        .toLocaleDateString(
                            "en-CA",
                            {
                                timeZone:
                                    "Asia/Kolkata",
                            }
                        );

                return (
                    goalDate ===
                    today
                );
            }
        );

    const historyGoals =
        groupData.goals.filter(
            (goal) => {

                const goalDate =
                    new Date(
                        goal.goal_date
                    )
                        .toLocaleDateString(
                            "en-CA",
                            {
                                timeZone:
                                    "Asia/Kolkata",
                            }
                        );

                return (
                    goalDate !==
                    today
                );
            }
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col gap-4">

                        <div className="flex justify-between items-start">
                            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                                Commitly Group
                            </div>

                            <div className="flex items-center gap-3">

                                {isOwner && (
                                    <button
                                        onClick={handleDeleteGroup}
                                        className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-100 transition"
                                    >
                                        Delete
                                    </button>
                                )}

                                {!isOwner && (
                                    <button
                                        onClick={handleLeaveGroup}
                                        className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200 transition"
                                    >
                                        Leave
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-100 transition"
                                >
                                    ← Back
                                </button>

                            </div>
                        </div>

                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold leading-[1.35] bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
                                {groupData.group.name}
                            </h1>

                            <p className="text-slate-500 mt-3 text-lg ">
                                {groupData.group.description ||
                                    "Track goals, verify progress and stay accountable together."}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Top Actions */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">

                    {/* Create Goal */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-semibold text-slate-900 mb-1">
                            Create Goal
                        </h2>

                        <p className="text-slate-500 text-sm mb-5">
                            Add a new goal and track your progress.
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Enter your goal..."
                                value={goalTitle}
                                onChange={(e) =>
                                    setGoalTitle(e.target.value)
                                }
                                className="flex-1 px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />

                            <button
                                onClick={handleCreateGoal}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                Add Goal
                            </button>
                        </div>
                    </div>

                    {/* Invite Member */}
                    {isOwner && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl transition-all duration-300">
                            <h2 className="text-xl font-semibold text-slate-900 mb-1">
                                Invite Member
                            </h2>

                            <p className="text-slate-500 text-sm mb-5">
                                Add friends and build accountability.
                            </p>

                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Friend email..."
                                    value={memberEmail}
                                    onChange={(e) =>
                                        setMemberEmail(e.target.value)
                                    }
                                    className="flex-1 px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />

                                <button
                                    onClick={handleAddMember}
                                    className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                                >
                                    Invite
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Members */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-rose-100 mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Members
                        </h2>

                        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                            {groupData.members.length} members
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupData.members.map((member) => (
                            <div
                                key={member.id}
                                className="border border-rose-100 rounded-2xl p-4 flex items-center gap-4 hover:border-rose-300 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white font-bold text-lg">
                                    {member.name?.charAt(0)?.toUpperCase()}
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">
                                        {member.name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {member.role === "owner"
                                            ? "👑 Owner"
                                            : "Group Member"}
                                    </p>
                                </div>
                                {isOwner &&
                                    member.role !== "owner" && (

                                        <button
                                            onClick={() =>
                                                handleRemoveMember(
                                                    member.id
                                                )
                                            }
                                            className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                                        >
                                            Remove
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md border border-amber-100 mb-8">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                🏆 Leaderboard
                            </h2>

                            <p className="text-slate-500 text-sm">
                                Top verified performers in this group
                            </p>
                        </div>

                    </div>

                    {groupData.leaderboard?.map(
                        (user, index) => {

                            const medal =
                                index === 0
                                    ? "🥇"
                                    : index === 1
                                        ? "🥈"
                                        : index === 2
                                            ? "🥉"
                                            : `#${index + 1}`;

                            return (

                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-amber-50 transition mb-2"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="text-2xl">
                                            {medal}
                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-slate-900">
                                                {user.name}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Verified Goals
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <div className="text-2xl font-bold text-amber-600">
                                            {user.verified_count}
                                        </div>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

                {/* Goals Header */}
                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Today's Goals
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Manage and verify completed goals
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                navigate(
                                    `/group/${groupId}/history`
                                )
                            }
                            className="px-4 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 transition"
                        >
                            📜 History
                        </button>

                    </div>

                </div>

                {/* Goals List */}
                <div className="space-y-5">

                    {todaysGoals.map((goal) => (
                        <div
                            key={goal.id}
                            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white font-bold shrink-0">
                                        {goal.user_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {goal.title}
                                        </h3>

                                        <p className="text-slate-500 mt-1">
                                            Created by {
                                                goal.user_id === currentUserId
                                                    ? "You"
                                                    : goal.user_name
                                            }
                                        </p>

                                    </div>
                                </div>

                                <div className="flex items-center gap-3">

                                    {goal.user_id === currentUserId &&
                                        !goal.verified_by && (
                                            <button
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                className="px-3 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                                            >
                                                Delete
                                            </button>
                                        )}

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${goal.status === "VERIFIED"
                                            ? "bg-emerald-100 text-emerald-700"

                                            : goal.status === "COMPLETED"
                                                ? "bg-blue-100 text-blue-700"

                                                : goal.status === "MISSED"
                                                    ? "bg-rose-100 text-rose-700"

                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {goal.status === "VERIFIED"
                                            ? "✓ VERIFIED"
                                            : goal.status === "COMPLETED"
                                                ? "AWAITING VERIFICATION"
                                                : goal.status}
                                    </span>

                                </div>
                            </div>

                            {goal.proof_url && (
                                <div className="mt-6">
                                    <a
                                        href={`${SERVER_URL}${goal.proof_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={`${SERVER_URL}${goal.proof_url}`}
                                            alt="Proof"
                                            className="w-full max-w-xs rounded-2xl border border-rose-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                                        />
                                    </a>
                                </div>
                            )}

                            {goal.user_id === currentUserId &&
                                goal.status === "COMPLETED" &&
                                !goal.verified_by && (
                                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setSelectedFiles(
                                                    (prev) => ({
                                                        ...prev,
                                                        [goal.id]:
                                                            e.target.files[0],
                                                    })
                                                )
                                            }
                                            className="border border-rose-200 rounded-xl p-2 file:mr-3 file:border-0 file:bg-rose-100 file:text-rose-700 file:px-3 file:py-1 file:rounded-lg"
                                        />

                                        <button
                                            onClick={() =>
                                                handleUploadProof(goal.id)
                                            }
                                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transition"
                                        >
                                            Upload Proof
                                        </button>
                                    </div>
                                )}

                            {!goal.verified_by &&
                                goal.user_id !== currentUserId &&
                                goal.status === "COMPLETED" &&
                                goal.proof_url && (
                                    <button
                                        onClick={() =>
                                            handleVerifyGoal(goal.id)
                                        }
                                        className="mt-5 bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white px-5 py-2 rounded-xl hover:shadow-lg transition"
                                    >
                                        Verify Goal
                                    </button>
                                )}

                            {goal.user_id === currentUserId &&
                                goal.status === "PENDING" &&
                                !goal.verified_by && (
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    goal.id,
                                                    "COMPLETED"
                                                )
                                            }
                                            className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                )}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default GroupDetailsPage;