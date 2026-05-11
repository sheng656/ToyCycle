import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '../../components/ui/TabBar';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.explore'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="toys"
        options={{
          title: t('tabs.list'),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: t('tabs.publish'),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabs.messages'),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
