import TopBar from '@/components/TopBar';
import AuthWrapper from '@/components/AuthWrapper';
import PortfolioCard from '@/components/PortfolioCard';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import RiskGuardCard from '@/components/RiskGuardCard';
import SignalTable from '@/components/SignalTable';
import TradingViewChart from '@/components/TradingViewChart';
import TradeHistoryTimeline from '@/components/TradeHistoryTimeline';
import TriggerCenter from '@/components/TriggerCenter';
import TradeHistory from '@/components/TradeHistory';

export default function Home() {
  return (
    <AuthWrapper>
      <TopBar />
      
      <main className="flex-1 p-6 space-y-6 container mx-auto max-w-[1600px] mb-8">
        {/* Top Grid - Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="lg:col-span-2 xl:col-span-1">
            <PortfolioCard />
          </div>
          <div className="lg:col-span-2 xl:col-span-2">
            <PerformanceMetrics />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <RiskGuardCard />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <TriggerCenter />
          </div>
        </section>

        {/* Middle Grid - Charts and Signals */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
           <div className="lg:col-span-2 h-full">
            <TradingViewChart />
           </div>
           <div className="lg:col-span-1 h-full">
            <SignalTable />
           </div>
        </section>

        {/* Bottom Grid - History & Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-full lg:h-[500px]">
              <TradeHistory />
           </div>
           <div className="lg:col-span-1 h-full lg:h-[500px]">
              <TradeHistoryTimeline />
           </div>
        </section>
      </main>
    </AuthWrapper>
  );
}
