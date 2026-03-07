export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Настройки</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Смена пароля</h3>
          <p className="text-sm text-gray-500">Функционал смены пароля будет реализован здесь.</p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Согласие на электронный расчётный листок
          </h3>
          <p className="text-sm text-gray-500">
            Управление согласием на получение расчётного листка в электронном виде.
          </p>
        </div>
      </div>
    </div>
  );
}
