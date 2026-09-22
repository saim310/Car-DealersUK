import TestDrives from "@/components/dashboard/TestDrives";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Test Drives",
  description: "Manage test drive requests",
};

export default function TestDrivesPage() {
  return (
    <>
      <Sidebar />
      <div id="wrapper-dashboard">
        <TestDrives />
      </div>
    </>
  );
}
