import Image from 'next/image';

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/google.svg"
      alt="Google"
      width={20}
      height={20}
      className={className}
    />
  );
}
