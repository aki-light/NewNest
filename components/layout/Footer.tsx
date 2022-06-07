export default function Footer({ history }: { history: string }) {
  return (
    <footer className="mt-14 text-center absolute bottom-0 w-full text-white text-xl py-6 bg-brown">
      <p>
        <small>&copy; {history} NewNest</small>
      </p>
    </footer>
  );
}
