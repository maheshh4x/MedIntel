import { DoctorPatientDetail } from '../../../../components/ui/DoctorPatientDetail';

export default async function DoctorPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <DoctorPatientDetail patientId={resolvedParams.id} />;
}