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
    const [selectedFile, setSelectedFile] =
        useState(null);

    const currentUserId =
        Number(localStorage.getItem("userId"));

    const currentMember =
        groupData?.members?.find(
            (member) =>
                member.id === currentUserId
        );

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
            await createGoal(groupId, {
                title: goalTitle,
                goal_date: new Date()
                    .toISOString()
                    .split("T")[0],
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex justify-between items-start">

                        <div>
                            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                Commitly Group
                            </div>

                            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
                                {groupData.group.name}
                            </h1>

                            <p className="text-slate-500 mt-3 text-lg">
                                Track goals, verify progress and stay accountable together.
                            </p>
                        </div>

                        {isOwner && (
                            <button
                                onClick={handleDeleteGroup}
                                title="Delete Group"
                                className="px-3 py-2 rounded-xl bg-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-300 hover:text-rose-800 transition"
                            >
                                Delete
                            </button>
                        )}

                        {!isOwner && (
                            <button
                                onClick={handleLeaveGroup}
                                title="Leave Group"
                                className="px-3 py-2 rounded-xl bg-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-300 hover:text-rose-800 transition"
                            >
                                Leave
                            </button>
                        )}

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

                {/* Goals Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Goals
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Manage and verify completed goals
                        </p>
                    </div>

                    <span className="bg-white border border-rose-100 px-4 py-2 rounded-xl text-slate-600 text-sm shadow-sm">
                        {groupData.goals.length} total goals
                    </span>
                </div>

                {/* Goals List */}
                <div className="space-y-5">
                    {groupData.goals.map((goal) => (
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

                                        <p className="text-slate-500">
                                            Created by {goal.user_name}
                                        </p>

                                    </div>
                                </div>

                                <div className="flex items-center gap-3">

                                    {goal.user_id === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            className="px-3 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                                        >
                                            Delete
                                        </button>
                                    )}

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${goal.status === "COMPLETED"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : goal.status === "MISSED"
                                                ? "bg-rose-100 text-rose-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {goal.status}
                                    </span>

                                </div>
                            </div>

                            {goal.proof_url && (
                                <div className="mt-6">
                                    <a
                                        href={`http://localhost:5000${goal.proof_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={`http://localhost:5000${goal.proof_url}`}
                                            alt="Proof"
                                            className="w-56 rounded-2xl border border-rose-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                                        />
                                    </a>
                                </div>
                            )}

                            {goal.user_id === currentUserId &&
                                goal.status === "COMPLETED" && (
                                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setSelectedFile(
                                                    e.target.files[0]
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

                            {goal.verified_by ? (
                                <div className="mt-5">
                                    <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-medium">
                                        ✓ Verified
                                    </span>
                                </div>
                            ) : (
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
                                )
                            )}

                            {goal.user_id === currentUserId && (
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

                                    <button
                                        onClick={() =>
                                            handleStatusUpdate(
                                                goal.id,
                                                "MISSED"
                                            )
                                        }
                                        className="px-5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
                                    >
                                        Missed
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