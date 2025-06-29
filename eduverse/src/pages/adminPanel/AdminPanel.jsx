
import React from "react";
import AdminDashboardCards from "./AdminDashboardCards";
import CreateClassSection from "./CreateClassSection";
import BulkRoleAssignSection from "./BulkRoleAssignSection";
import DeleteClassSection from "./DeleteClassSection";
// import PendingUsersSection from "./PendingUsersSection";
import ClassCards from "./ClassCards";
import ManageSubjectsSection from "./ManageSubjectsSection";
import { Link } from "react-router";


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
       <Link to="/admin/courses" className="btn btn-outline-primary mt-3">
  📚 Kursları İdarə Et
</Link>
    </div>
    
  );
 
};

export default AdminPanel;
