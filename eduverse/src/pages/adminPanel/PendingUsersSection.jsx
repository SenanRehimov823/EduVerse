import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PendingUsersSection.module.css";

const PendingUsersSection = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("student");

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/all-users", { withCredentials: true });
        const pending = res.data.users.filter(user => user.role === "pending");
        setPendingUsers(pending);
      } catch (err) {
        console.error("Xəta baş verdi", err);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleSelect = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleRoleAssign = async () => {
    if (!selectedUsers.length) return;

    try {
      await axios.put("http://localhost:5000/api/admin/set-multiple-roles", {
        userIds: selectedUsers,
        role: filterRole
      }, { withCredentials: true });

      alert("Rollar təyin olundu");
      setSelectedUsers([]);
      setPendingUsers(prev => prev.filter(u => !selectedUsers.includes(u._id)));
    } catch (err) {
      console.error("Rolu təyin etmək olmadı", err);
    }
  };

  const filteredUsers = pendingUsers.filter(u =>
    filterRole === "student" ? u.grade : u.subject
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🕒 Gözləyən istifadəçilər ({filterRole === "student" ? "Şagirdlər" : "Müəllimlər"})</h3>

      <div className={styles.radioGroup}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="student"
            checked={filterRole === "student"}
            onChange={() => setFilterRole("student")}
          />
          Şagird
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            value="teacher"
            checked={filterRole === "teacher"}
            onChange={() => setFilterRole("teacher")}
          />
          Müəllim
        </label>
      </div>

      <ul className={styles.userList}>
        {filteredUsers.map((user) => (
          <li key={user._id}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleSelect(user._id)}
              />
              {user.name}{" "}
              {filterRole === "teacher" && user.subject?.name && `(Fənn: ${user.subject.name})`}
              {filterRole === "student" && user.class?.name && ` – ${user.class.name}`}
            </label>
          </li>
        ))}
      </ul>

      <button
        className={styles.button}
        onClick={handleRoleAssign}
        disabled={selectedUsers.length === 0}
      >
        ✅ Seçilənlərə "{filterRole}" rolu təyin et
      </button>
    </div>
  );
};

export default PendingUsersSection;
