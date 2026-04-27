import { PageWrapper } from '@/components/common/PageWrapper';
import WelcomeContent from './client';

export default function WelcomePage() {
  return (
    <PageWrapper
      title={{
        en: 'Welcome to Ukrainian Saturday School',
        uk: 'Вітаємо в Українській суботній школі'
      }}
      description={{
        en: 'Full information about lessons, tuition, and school contacts.',
        uk: 'Повна інформація про навчання, оплату та контакти школи.'
      }}
    >
      <WelcomeContent />
    </PageWrapper>
  );
}
