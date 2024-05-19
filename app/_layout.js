import { Slot, Stack, Screen } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

export default function HomeLayout() {
  return (
    <SQLiteProvider databaseName="money-plant-database">
      <Stack>
      </Stack>
    </SQLiteProvider>
  )
}
