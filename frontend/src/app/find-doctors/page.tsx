import { PublicPage } from '../../components/layout/PublicPage';
import { DoctorDirectory } from '../../components/ui/DoctorDirectory';
export default function FindDoctors() { return <PublicPage title="Find the right care, sooner." intro="Search trusted providers by specialty and location, then choose a time that fits your day."><DoctorDirectory /></PublicPage>; }