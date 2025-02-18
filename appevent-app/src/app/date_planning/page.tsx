import { Layout } from "@/components/layout/Layout";
import { CalendarView } from "@/components/date_planning/CalendarView";

export default function DatePlanningPage() {
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Mine arrangementer
        </h1>
        <div className="bg-[#96A074] rounded-lg shadow-lg p-4 md:p-6">
          <CalendarView />
        </div>
      </div>
    </Layout>
  );
}
