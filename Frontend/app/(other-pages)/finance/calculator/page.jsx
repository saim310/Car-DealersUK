import FinanceCalculator from "@/components/finance/FinanceCalculator";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";


export const metadata = {
  title: "Finance Calculator",
  description: "Calculate your vehicle finance repayment amounts",
};

export default function FinanceCalculatorPage() {
  return (
  <>
    <div className="header-fixed">
          <Header2 />
        </div>
  <FinanceCalculator />
  <Footer1 />
  </>
  )
}
