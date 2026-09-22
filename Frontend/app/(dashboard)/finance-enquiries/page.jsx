import FinanceEnquiries from "@/components/dashboard/FinanceEnquiries";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Finance Enquiries",
  description: "Manage finance enquiries",
};

export default function FinanceEnquiriesPage() {
  return(
  <>
  <Sidebar />
   <div id="wrapper-dashboard">
  <FinanceEnquiries />
  </div>
  </>
);
}
