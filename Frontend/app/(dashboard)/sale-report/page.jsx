import Sidebar from "@/components/dashboard/Sidebar";
import SaleReport from "@/components/dashboard/SaleReport";

export default function SaleReportPage() {
  return (
    <>
      <Sidebar />
      <div id="wrapper-dashboard">
        <div className="dashboard-toggle">Show DashBoard</div>
        <SaleReport />
      </div>
    </>
  );
}
