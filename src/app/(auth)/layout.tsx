export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {/* Replace with your logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-dumbbell h-4 w-4"
            >
              <path d="M14.4 14.4 9.6 9.6" />
              <path d="M18.65 21.35a5 5 0 0 0-7.07-7.07l-9.9 9.9a5 5 0 0 0 7.07 7.07l9.9-9.9Z" />
              <path d="m21.5 21.5-1.4-1.4" />
              <path d="M3.9 3.9 2.5 2.5" />
              <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.414-1.414a2 2 0 0 1 2.828 2.828l-1.413 1.415Z" />
              <path d="M14.06 9.172a2 2 0 1 1-2.828-2.828l1.414-1.414a2 2 0 0 1 2.828 2.828l-1.414 1.414Z" />
            </svg>
          </div>
          GymOS
        </a>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
