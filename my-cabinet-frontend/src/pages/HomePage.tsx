import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { iin } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Главная</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">
          Добро пожаловать в личный кабинет сотрудника!
        </p>
        <p className="text-sm text-gray-500 mt-2">ИИН: {iin}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Расчётный листок</h3>
          <p className="text-sm text-gray-500">Просмотр и скачивание PDF</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Отпуска</h3>
          <p className="text-sm text-gray-500">Информация об отпусках</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Сертификаты</h3>
          <p className="text-sm text-gray-500">Ваши сертификаты</p>
        </div>
      </div>
    </div>
  );
}
