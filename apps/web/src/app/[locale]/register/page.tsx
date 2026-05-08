import { setRequestLocale } from 'next-intl/server';
import RegisterForm from '@/components/auth/RegisterForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-12">
      <RegisterForm />
    </div>
  );
}
