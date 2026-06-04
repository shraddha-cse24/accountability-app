import { useEffect, useState } from "react";
import { getMyGroups, createGroup, } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { getMyStats } from "../services/statsService";

function DashboardPage() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

  useEffect(() => {
  fetchGroups();
  fetchStats();
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
  const handleCreateGroup = async () => {
    try {
      await createGroup({
        name: groupName,
        description: "",
      });

      setGroupName("");

      fetchGroups();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    My Groups
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
  
</div>

{stats && (
  <div className="grid grid-cols-2 gap-4 mb-6">

    <div className="border p-4 rounded">
      <h3>Total Goals</h3>
      <p>{stats.totalGoals}</p>
    </div>

    <div className="border p-4 rounded">
      <h3>Completed</h3>
      <p>{stats.completedGoals}</p>
    </div>

    <div className="border p-4 rounded">
      <h3>Missed</h3>
      <p>{stats.missedGoals}</p>
    </div>

    <div className="border p-4 rounded">
      <h3>Verified</h3>
      <p>{stats.verifiedGoals}</p>
    </div>

  </div>
)}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
          className="border p-2"
        />

        <button
          onClick={handleCreateGroup}
          className="bg-blue-500 text-white px-4"
        >
          Create
        </button>
      </div>

      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() =>
            navigate(`/group/${group.id}`)
          }
          className="border p-4 rounded mb-4 cursor-pointer"
        >
          <h2 className="text-xl font-semibold">
            {group.name}
          </h2>

          <p>{group.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;