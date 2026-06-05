import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupDetails, addMember, } from "../services/groupDetailsService";
import { createGoal, updateGoalStatus, verifyGoal, } from "../services/goalService";
import { uploadProof } from "../services/proofService";

function GroupDetailsPage() {
    const { groupId } = useParams();

    const [groupData, setGroupData] = useState(null);
    const [goalTitle, setGoalTitle] = useState("");

    const [memberEmail, setMemberEmail] = useState("");
    const [selectedFile, setSelectedFile] =
        useState(null);

    const currentUserId =
        Number(localStorage.getItem("userId"));

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

            setMemberEmail("");

            fetchGroup();

        } catch (error) {
            console.error(error);
        }
    };

    if (!groupData) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">
                {groupData.group.name}
            </h1>

            <h2 className="text-xl mt-6 mb-2">
                <div className="flex gap-2 mt-4 mb-4">
                    <input
                        type="text"
                        placeholder="Enter Goal"
                        value={goalTitle}
                        onChange={(e) =>
                            setGoalTitle(e.target.value)
                        }
                        className="border p-2"
                    />

                    <button
                        onClick={handleCreateGoal}
                        className="bg-green-500 text-white px-4"
                    >
                        Add Goal
                    </button>
                </div>
                Members
            </h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="email"
                    placeholder="Friend Email"
                    value={memberEmail}
                    onChange={(e) =>
                        setMemberEmail(
                            e.target.value
                        )
                    }
                    className="border p-2"
                />

                <button
                    onClick={handleAddMember}
                    className="bg-blue-500 text-white px-4"
                >
                    Add Member
                </button>
            </div>

            {groupData.members.map((member) => (
                <p key={member.id}>
                    {member.name}
                </p>
            ))}

            <h2 className="text-xl mt-6 mb-2">
                Goals
            </h2>

            {groupData.goals.map((goal) => (
                <div
                    key={goal.id}
                    className="border p-3 mb-2 rounded"
                >
                    <p>
                        {goal.user_name} - {goal.title}
                    </p>

                    <p>Status: {goal.status}</p>

                    {goal.proof_url && (
                        <div className="mt-2">
                            <a
                                href={`http://localhost:5000${goal.proof_url}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={`http://localhost:5000${goal.proof_url}`}
                                    alt="Proof"
                                    className="w-40 border rounded cursor-pointer"
                                />
                            </a>
                        </div>
                    )}

                    {goal.user_id === currentUserId &&
                        goal.status === "COMPLETED" && (
                            <div className="mt-2">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedFile(
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <button
                                    onClick={() =>
                                        handleUploadProof(goal.id)
                                    }
                                    className="bg-purple-500 text-white px-3 py-1 ml-2"
                                >
                                    Upload Proof
                                </button>
                            </div>
                        )}


                    {goal.verified_by ? (
                        <p className="text-green-600 font-bold">
                            ✅ Verified
                        </p>
                    ) : (
                        goal.user_id !== currentUserId &&
                        goal.status === "COMPLETED" &&
                        goal.proof_url && (
                            <button
                                onClick={() =>
                                    handleVerifyGoal(goal.id)
                                }
                                className="bg-blue-500 text-white px-3 py-1 mt-2"
                            >
                                Verify
                            </button>
                        )
                    )}

                    {goal.user_id === currentUserId && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() =>
                                    handleStatusUpdate(
                                        goal.id,
                                        "COMPLETED"
                                    )
                                }
                                className="bg-green-500 text-white px-3 py-1"
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
                                className="bg-red-500 text-white px-3 py-1"
                            >
                                Missed
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default GroupDetailsPage;