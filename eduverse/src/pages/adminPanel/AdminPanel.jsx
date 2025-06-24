
import React from "react";
import AdminDashboardCards from "./AdminDashboardCards";
import CreateClassSection from "./CreateClassSection";
import BulkRoleAssignSection from "./BulkRoleAssignSection";
import DeleteClassSection from "./DeleteClassSection";
// import PendingUsersSection from "./PendingUsersSection";
import ClassCards from "./ClassCards";
import ManageSubjectsSection from "./ManageSubjectsSection";



const AdminPanel = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🎓 Admin Paneli</h1>
      <AdminDashboardCards />
      <hr />
      <CreateClassSection />
      <hr />
      <BulkRoleAssignSection />
      <hr />
      {/* <PendingUsersSection /> */}
      <hr />

   <ClassCards/>
      <hr />
  <ManageSubjectsSection/>
      <hr />
      <DeleteClassSection />
    </div>
  );
};

export default AdminPanel;
