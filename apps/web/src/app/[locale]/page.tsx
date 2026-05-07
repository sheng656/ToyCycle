import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary/20 text-primary-dark text-sm font-medium mb-8 animate-slide-up">
              <span>🌱</span>
              <span>减少浪费，建立邻里</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t('home.hero')}
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                ToyCycle
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t('home.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/toys/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
                id="cta-publish"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t('home.ctaPublish')}
              </Link>
              <Link
                href="/toys"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-8 py-3.5 text-base font-semibold hover:border-primary hover:text-primary hover:bg-primary-50 transition-all"
                id="cta-browse"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {t('home.ctaBrowse')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-surface-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8">
            <StatCard emoji="🔄" value="1,280+" label={t('home.statsExchanged')} />
            <StatCard emoji="👨‍👩‍👧‍👦" value="560+" label={t('home.statsFamilies')} />
            <StatCard emoji="♻️" value="320kg" label={t('home.statsWasteSaved')} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              简单三步，让玩具流转
            </h2>
            <p className="mt-4 text-lg text-muted">
              基于等时圈技术，精准匹配你附近的家庭
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              emoji="📸"
              title="拍照发布"
              description="拍几张照片，填写玩具信息，设定玩具币估值，一键发布"
            />
            <StepCard
              number="02"
              emoji="🗺️"
              title="附近发现"
              description="查看 15 分钟步行或车程范围内的玩具，等时圈精准匹配"
            />
            <StepCard
              number="03"
              emoji="🤝"
              title="邻里交换"
              description="发起交换请求，聊天沟通细节，线下见面完成交换"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-surface-elevated border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">为什么选择玩具循环？</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              emoji="🏘️"
              title="邻里优先"
              description="等时圈地图驱动，展示步行或车程 15 分钟内的玩具"
            />
            <FeatureCard
              emoji="💰"
              title="玩具币系统"
              description="分享玩具赚积分，用积分领取其他家庭的玩具"
            />
            <FeatureCard
              emoji="🛡️"
              title="信任安全"
              description="成色评级、清洁认证、信用评分，安心交换"
            />
            <FeatureCard
              emoji="🌍"
              title="绿色环保"
              description="减少塑料浪费，追踪你的环保贡献，玩具不浪费"
            />
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            准备好让玩具流转了吗？
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            加入玩具循环社区，为你的孩子发现新玩具，为闲置的玩具找到新家。
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl transition-all active:scale-[0.98]"
            id="cta-register"
          >
            🚀 立即加入
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  emoji,
  title,
  description,
}: {
  number: string;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative group">
      <div className="p-8 rounded-2xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-full">
            {number}
          </span>
          <span className="text-3xl">{emoji}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="text-3xl mb-4">{emoji}</div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
