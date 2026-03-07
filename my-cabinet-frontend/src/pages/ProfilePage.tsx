import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { iin } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Мой кабинет</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">ИИН</span>
            <p className="text-gray-800 font-medium">{iin}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
