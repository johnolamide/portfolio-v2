// Simple test component to verify Tailwind CSS is working
export function TailwindTest() {
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-500 text-white p-2 rounded-lg shadow-lg">
      <p className="text-sm font-bold">Tailwind Test</p>
      <p className="text-xs">Red background = Working!</p>
    </div>
  );
}