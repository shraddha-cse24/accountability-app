import { useEffect, useRef, useState } from "react";
import { getMyGroups, createGroup, } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { getMyStats, getMyStreak, getTodayProgress } from "../services/statsService";
import {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../services/invitationService";
import { getNotifications, markNotificationsRead, }
  from "../services/notificationService";
import {
  getProfile
} from "../services/profileService";

function DashboardPage() {
  const [groups, setGroups] = useState([]);
  const [invitations, setInvitations] =
    useState([]);
  const [groupName, setGroupName] = useState("");
  const [stats, setStats] = useState(null);
  const [groupDescription,
    setGroupDescription] =
    useState("");
  const [notifications,
    setNotifications] =
    useState([]);
  const [notificationsSeen, setNotificationsSeen] =
    useState(false);
  const [streak, setStreak] =
    useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");

  };
  const [activePopup, setActivePopup] =
    useState(null);
  const popupRef =
    useRef(null);
  const [todayProgress,
    setTodayProgress] =
    useState(null);
  const [unreadCount,
    setUnreadCount] =
    useState(0);
  const [showCreateGroupModal,
    setShowCreateGroupModal] =
    useState(false);
  const [profile,
    setProfile] =
    useState(null);

  useEffect(() => {
    fetchGroups();
    fetchStats();
    fetchStreak();
    fetchInvitations();
    fetchNotifications();
    fetchTodayProgress();
    fetchProfile();
  }, []);

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          popupRef.current &&
          !popupRef.current.contains(
            event.target
          )
        ) {

          setActivePopup(null);

        }

      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

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
  const fetchNotifications =
    async () => {

      try {

        const data =
          await getNotifications();

        setNotifications(
          data.notifications
        );

        setUnreadCount(
          data.notifications.filter(
            n => !n.is_read
          ).length
        );

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

  const fetchTodayProgress =
    async () => {

      try {

        const data =
          await getTodayProgress();

        setTodayProgress(data);

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

  const fetchProfile =
    async () => {

      try {

        const data =
          await getProfile();

        setProfile(data);

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
      if (!groupName.trim()) {
        return alert(
          "Group name is required"
        );
      }

      if (groupName.trim().length > 100) {
        return alert(
          "Group name too long"
        );
      }
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-10">

          <div className="flex justify-between items-start gap-4">

            {/* Left Side */}
            <div>

              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
                Dashboard
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.3] font-bold bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 bg-clip-text text-transparent">
                Hi, {profile?.user?.name?.split(" ")[0]}!
              </h1>

            </div>

            {/* Right Side Icons */}
            <div ref={popupRef} className="flex items-center gap-2 mt-3">

              {/* Streak */}
              <div className="relative">

                <button
                  onClick={() =>
                    setActivePopup(
                      activePopup === "streak"
                        ? null
                        : "streak"
                    )
                  }
                  className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl hover:bg-orange-100 hover:shadow-md transition-all"
                >
                  🔥
                </button>

                {activePopup === "streak" && (

                  <div className="absolute right-0 top-14 w-32 bg-white rounded-xl shadow-lg border border-orange-100 p-3 z-50">

                    <p className="text-[11px] uppercase tracking-wide text-slate-400 text-center">
                      Current Streak
                    </p>

                    <div className="flex items-center justify-center gap-1 mt-2">

                      <span className="text-2xl">
                        🔥
                      </span>

                      <span className="text-2xl font-bold text-orange-600">
                        {streak?.currentStreak || 0}
                      </span>

                    </div>

                    <p className="text-xs text-slate-500 text-center mt-2">
                      Keep going! 🚀
                    </p>

                  </div>

                )}

              </div>

              {/* Notifications */}
              <div className="relative">

                <button
                  onClick={async () => {

                    const nextState =
                      activePopup !==
                      "notifications";

                    setActivePopup(
                      nextState
                        ? "notifications"
                        : null
                    );

                    if (
                      nextState &&
                      unreadCount > 0
                    ) {

                      await markNotificationsRead();

                      setNotifications(
                        (prev) =>
                          prev.map(
                            (notification) => ({
                              ...notification,
                              is_read: true,
                            })
                          )
                      );

                      setUnreadCount(0);

                    }

                  }}
                  className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-xl hover:bg-rose-50 hover:shadow-md transition-all"
                >
                  🔔
                </button>

                {unreadCount > 0 && (

                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold shadow-md">
                    {unreadCount}
                  </div>

                )}

                {activePopup ===
                  "notifications" && (

                    <div className="absolute right-0 top-14 w-80 max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden z-50">

                      {/* Header */}
                      <div className="px-5 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50/70 to-pink-50/40">

                        <h3 className="font-bold text-slate-900">
                          Notifications
                        </h3>

                      </div>

                      {/* Body */}
                      <div className="max-h-80 overflow-y-auto">

                        {notifications.length === 0 ? (

                          <div className="py-10 px-6 text-center">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl mb-4">
                              🔔
                            </div>

                            <h4 className="font-semibold text-slate-700">
                              No notifications
                            </h4>

                            <p className="text-sm text-slate-400 mt-1">
                              You're all caught up.
                            </p>

                          </div>

                        ) : (

                          notifications.map(
                            (notification, index) => (

                              <div
                                key={notification.id}
                                className={`px-5 py-4 hover:bg-rose-50/70 transition ${index !== notifications.length - 1
                                  ? "border-b border-rose-50"
                                  : ""
                                  }`}
                              >

                                <p className="text-sm text-slate-700 leading-relaxed">
                                  {notification.message}
                                </p>

                              </div>

                            )
                          )

                        )}

                      </div>

                    </div>

                  )}

              </div>

              {/* Menu */}
              <div className="relative">

                <button
                  onClick={() =>
                    setActivePopup(
                      activePopup === "menu"
                        ? null
                        : "menu"
                    )
                  }
                  className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-xl hover:bg-rose-50 hover:shadow-md transition-all"
                >
                  ⋮
                </button>

                {activePopup === "menu" && (

                  <div className="absolute right-0 top-14 w-36 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden z-50">

                    <button
                      onClick={() =>
                        navigate("/profile")
                      }
                      className="w-full px-4 py-3 text-left hover:bg-rose-50 transition flex items-center gap-3"
                    >
                      <span>👤</span>

                      <span className="text-sm font-medium text-slate-700">
                        Profile
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-rose-50 transition flex items-center gap-3 border-t border-rose-50"
                    >
                      <span>🚪</span>

                      <span className="text-sm font-medium text-rose-600">
                        Logout
                      </span>
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

          <p className="text-slate-500 mt-3 text-base sm:text-lg">
            Create goals, stay consistent, and grow together.
          </p>

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

        {todayProgress && (

          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-md mb-8">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  🎯 Today's Progress
                </h2>

                <p className="text-slate-500 mt-1">
                  Track today's accountability goals
                </p>

              </div>

              <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-xs text-slate-500">
                  Completion
                </p>

                <p className="text-3xl font-bold text-rose-600">
                  {todayProgress.total === 0
                    ? 0
                    : Math.round(
                      (todayProgress.completed /
                        todayProgress.total) * 100
                    )
                  }%
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-xs text-slate-600">
                  Goals
                </p>

                <h3 className="text-3xl font-bold">
                  {todayProgress.total}
                </h3>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-xs text-emerald-600">
                  Completed
                </p>

                <h3 className="text-3xl font-bold text-emerald-600">
                  {todayProgress.completed}
                </h3>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-orange-500">
                  Remaining
                </p>

                <h3 className="text-3xl font-bold text-orange-500">
                  {todayProgress.remaining}
                </h3>
              </div>

            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-rose-500 to-fuchsia-600"
                style={{
                  width: `${todayProgress.total === 0
                    ? 0
                    : (todayProgress.completed /
                      todayProgress.total) * 100
                    }%`,
                }}
              />

            </div>

          </div>

        )}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Your Groups
            </h2>

          </div>

          <button
            onClick={() =>
              setShowCreateGroupModal(true)
            }
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-medium shadow-md hover:shadow-lg transition"
          >
            + New Group
          </button>

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
                    👥 {group.memberCount} {" "}
                    {group.memberCount === 1
                      ? "Member"
                      : "Members"}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 line-clamp-3">
                {group.description ||
                  "No description available."}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-rose-700 font-medium text-sm">
                  View Group →
                </span>
              </div>
            </div>
          ))}
        </div>
        {showCreateGroupModal && (

          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">

            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-slate-900">
                  Create Group
                </h2>

                <button
                  onClick={() =>
                    setShowCreateGroupModal(
                      false
                    )
                  }
                  className="text-slate-500 text-xl"
                >
                  ✕
                </button>

              </div>

              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) =>
                  setGroupName(
                    e.target.value
                  )
                }
                className="w-full mb-3 px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <textarea
                placeholder="Group Description"
                value={groupDescription}
                onChange={(e) =>
                  setGroupDescription(
                    e.target.value
                  )
                }
                rows={3}
                className="w-full mb-5 px-4 py-3 border border-rose-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setShowCreateGroupModal(
                      false
                    )
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {

                    await handleCreateGroup();

                    setShowCreateGroupModal(
                      false
                    );

                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-700 text-white font-medium"
                >
                  Create
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default DashboardPage;