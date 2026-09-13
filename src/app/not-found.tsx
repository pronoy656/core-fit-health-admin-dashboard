import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The requested page could not be found.</p>
      <Link href="/">Return to Home</Link>
    </div>
  );
}
