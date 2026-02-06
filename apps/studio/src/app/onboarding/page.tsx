'use client';

import { useRouter } from 'next/navigation';
import { SlaytQuiz } from '../../components/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = (result: {
    suggestedOrisha: string;
    suggestedSephira: string;
    suggestedTrajectory: string;
    suggestedAesthetic: string;
    confidence: number;
    insights: string[];
  }) => {
    // Store the quiz results in localStorage for use in character creation
    localStorage.setItem('slaytQuizResult', JSON.stringify(result));

    // Redirect to imprint creation with a flag
    router.push('/imprint?fromQuiz=true');
  };

  const handleSkip = () => {
    router.push('/imprint');
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <SlaytQuiz onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  );
}
