import LoginForm from "@/components/LoginForm";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <div className="z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}