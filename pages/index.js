
import ChatBoxStyled from '../components/ChatBoxStyled';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Rental Assistant</h1>
        <ChatBoxStyled />
      </div>
    </div>
  );
}
