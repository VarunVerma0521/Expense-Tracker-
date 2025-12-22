import StatsCards from '@/components/dashboard/stats-cards';
import WeeklySpendingChart from '@/components/dashboard/weekly-spending-chart';
import CategorySpendingChart from '@/components/dashboard/category-spending-chart';
import SpendingLimitGauge from '@/components/dashboard/spending-limit-gauge';
import AlertPanel from '@/components/dashboard/alert-panel';
import MonthlySpendingChart from '@/components/dashboard/monthly-spending-chart';
import SpendAnalyzer from '@/components/dashboard/spend-analyzer';

export default function DashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <StatsCards />
        <WeeklySpendingChart />
        <MonthlySpendingChart />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <SpendingLimitGauge />
        <CategorySpendingChart />
        <SpendAnalyzer />
        <AlertPanel />
      </div>
    </div>
  );
}
