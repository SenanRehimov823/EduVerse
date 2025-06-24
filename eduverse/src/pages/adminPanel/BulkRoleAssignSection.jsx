import React, { useEffect, useState } from "react";
import axios from "axios";

const BulkRoleAssignSection = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("student");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/admin/pending-users", { withCredentials: true });
      setPendingUsers(res.data);
    };
    fetchPendingUsers();
  }, []);

  const toggleUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = async () => {
    if (!selectedIds.length) return;
    await axios.put("http://localhost:5000/api/admin/set-multiple-roles", {
      userIds: selectedIds,
      role: selectedRole
    }, { withCredentials: true });
    window.location.reload();
  };

  return (
    <div>
      <h3>İstifadəçilərə Rol Təyin Et</h3>

      <div>
        <label>
          <input
            type="radio"
            value="student"
            checked={selectedRole === "student"}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          Şagirdlər
        </label>
        <label>
          <input
            type="radio"
            value="teacher"
            checked={selectedRole === "teacher"}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          Müəllimlər
        </label>
      </div>

      {pendingUsers
        .filter((u) => (selectedRole === "teacher" ? u.subjectName : u.grade))
        .map((user) => (
          <div key={user._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
              {user.name} - {selectedRole === "teacher" ? user.subjectName : user.class?.name || user.grade}
            </label>
          </div>
        ))}

      <button onClick={handleBulkAssign}>Rolu Təyin Et</button>
    </div>
  );
};

export default BulkRoleAssignSection;