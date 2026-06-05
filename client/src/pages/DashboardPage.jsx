import { useEffect, useState } from "react";
import { getMyGroups, createGroup, } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { getMyStats, getMyStreak, } from "../services/statsService";
import {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../services/invitationService";

function DashboardPage() {
  const [groups, setGroups] = useState([]);
  const [invitations, setInvitations] =
    useState([]);
  const [groupName, setGroupName] = useState("");
  const [stats, setStats] = useState(null);
  const [groupDescription,
    setGroupDescription] =
    useState("");
  const [streak, setStreak] =
    useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");

  };

  useEffect(() => {
    fetchGroups();
    fetchStats();
    fetchStreak();
    fetchInvitations();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getMyGroups();

      setGroups(data.groups);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStats = async () => {
    try {
      const data = await getMyStats();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStreak =
    async () => {
      try {

        const data = await getMyStreak();
        setStreak(data);

      } catch (error) {
        console.error(error);
      }
    };

  const fetchInvitations =
    async () => {
      try {
        const data =
          await getMyInvitations();

        console.log(data);

        setInvitations(
          data.invitations
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleAcceptInvitation =
    async (invitationId) => {
      try {

        await acceptInvitation(
          invitationId
        );

        fetchInvitations();
        fetchGroups();

      } catch (error) {
        console.error(error);
      }
    };

  const handleRejectInvitation =
    async (invitationId) => {
      try {

        await rejectInvitation(
          invitationId
        );

        fetchInvitations();

      } catch (error) {
        console.error(error);
      }
    };

  const handleCreateGroup = async () => {
    try {
      await createGroup({
        name: groupName,
        description: groupDescription,
      });

      setGroupName("");
      setGroupDescription("");

      fetchGroups();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
              Dashboard
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
              My Groups
            </h1>

            <p className="text-slate-500 mt-2 text-lg">
              Manage your accountability groups and track progress.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 mb-10">

            <h2 className="text-2xl font-bold text-slate-900 mb-5">
              Pending Invitations
            </h2>

            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="border border-rose-100 rounded-2xl p-5 mb-4"
              >
                <h3 className="font-semibold text-lg">
                  {invitation.group_name}
                </h3>

                <p className="text-slate-500">
                  Invited by {invitation.sender_name}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      handleAcceptInvitation(
                        invitation.id
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleRejectInvitation(
                        invitation.id
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {streak && (
          <div className="mb-6 flex justify-center">

            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-orange-50 border border-orange-200 shadow-sm">

              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                🔥
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Current Streak
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {streak.currentStreak}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl transition">
              <p className="text-slate-500 text-sm font-medium mb-2">
                Total Goals
              </p>

              <h3 className="text-4xl font-bold text-slate-900">
                {stats.totalGoals}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition">
              <p className="text-emerald-600 text-sm font-medium mb-2">
                Completed
              </p>

              <h3 className="text-4xl font-bold text-emerald-700">
                {stats.completedGoals}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 hover:shadow-xl transition">
              <p className="text-rose-600 text-sm font-medium mb-2">
                Missed
              </p>

              <h3 className="text-4xl font-bold text-rose-700">
                {stats.missedGoals}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-fuchsia-100 hover:shadow-xl transition">
              <p className="text-fuchsia-600 text-sm font-medium mb-2">
                Verified
              </p>

              <h3 className="text-4xl font-bold text-fuchsia-700">
                {stats.verifiedGoals}
              </h3>
            </div>

          </div>
        )}

        {/* Create Group */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-rose-100 mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Create New Group
          </h2>

          <p className="text-slate-500 text-sm mb-5">
            Start a new accountability group with your friends.
          </p>

          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) =>
              setGroupName(e.target.value)
            }
            className="w-full mb-3 px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />

          <textarea
            placeholder="Group Description (optional)"
            value={groupDescription}
            onChange={(e) =>
              setGroupDescription(
                e.target.value
              )
            }
            rows={3}
            className="w-full mb-4 px-4 py-3 border border-rose-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />

          <button
            onClick={handleCreateGroup}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition"
          >
            Create Group
          </button>
        </div>

        {/* Groups Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Your Groups
            </h2>

            <p className="text-slate-500 mt-1">
              Click a group to view goals and members.
            </p>
          </div>

          <span className="bg-white border border-rose-100 px-4 py-2 rounded-xl text-slate-600 text-sm shadow-sm">
            {groups.length} Groups
          </span>
        </div>

        {/* Group Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() =>
                navigate(`/group/${group.id}`)
              }
              className="bg-white rounded-3xl p-6 shadow-md border border-rose-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-rose-600 to-fuchsia-700 flex items-center justify-center text-white font-bold text-xl">
                  {group.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {group.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Accountability Group
                  </p>
                </div>
              </div>

              <p className="text-slate-600 line-clamp-3">
                {group.description ||
                  "No description available."}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-rose-700 font-medium text-sm">
                  View Group →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;