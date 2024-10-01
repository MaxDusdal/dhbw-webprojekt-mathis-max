export default function RoomDetail() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col p-10">
        <h1 className="text-2xl font-medium">Hier steht der Titel</h1>
        <div className="mt-6 h-96 w-full rounded-2xl bg-gray-200"></div>
        <div className="flex">
          <div className="w-2/3 py-8">
            <h1 className="text-2xl font-medium">Hier steht noch ein Text</h1>
            <p>Hier steht die anzahl Betten etc</p>
          </div>
          <div className="flex w-1/3 justify-end py-8">
            <div className="h-44 w-96 rounded-xl ring-1 ring-gray-300 hover:ring-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
