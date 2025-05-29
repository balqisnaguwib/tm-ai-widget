import SurveyForm from "@/components/SurveyForm";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SurveyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <div className="z-10 w-full max-w-2xl">
        <SurveyForm />
      </div>
    </div>
  );
}