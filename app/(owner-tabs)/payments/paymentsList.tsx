import { useLocalSearchParams } from 'expo-router';
import Payments from '@/src/modules/payments/Payments';

export default function OwnerPaymentsListScreen() {
  const { id } = useLocalSearchParams();
  return <Payments />;
}
