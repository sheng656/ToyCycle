import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import NewToyForm from '@/components/toys/NewToyForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewToyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NewToyContent />;
}

function NewToyContent() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('toys.listToy')}</h1>
      <p className="text-muted mb-8">填写玩具信息，让附近的家庭发现它</p>

      <NewToyForm />
    </div>
  );
}
