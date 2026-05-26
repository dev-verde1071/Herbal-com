import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <SignUp />
    </div>
  );
}
