import { redirect } from 'next/navigation';

export default function RootPage() {
  // Instantly redirect root landing to the B2B Operations Room Console
  redirect('/dashboard/ops');
}
