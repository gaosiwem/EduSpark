import { Drawer } from 'expo-router/drawer';
import DrawerContent from '@/components/DrawerContent';

export default function Layout() {
  return (
    <Drawer
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 260,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
    </Drawer>
  );
}