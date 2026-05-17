import { useLocalSearchParams } from 'expo-router';
import PlanFormScreen from '../../../src/modules/AdminModule/AdminPlans/screens/PlanFormScreen';

export default function EditPlanScreen() {
  const { id } = useLocalSearchParams();
  const planId = id ? parseInt(id as string) : undefined;
  
  return <PlanFormScreen planId={planId} />;
}
