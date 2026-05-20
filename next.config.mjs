/** @type {import('next').NextConfig} */

function supabaseStorageImageRemotePatterns() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    const protocol = url.protocol.replace(':', '');
    const pattern = {
      protocol,
      hostname: url.hostname,
      pathname: '/storage/v1/object/public/**'
    };
    if (url.port) {
      Object.assign(pattern, { port: url.port });
    }
    return [pattern];
  } catch {
    return [];
  }
}

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb'
    }
  },
  images: {
    remotePatterns: supabaseStorageImageRemotePatterns(),
    // Local Supabase (127.0.0.1:54321) in dev — Next.js 16 blocks private IPs by default (SSRF).
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development'
  }
};

export default nextConfig;
