export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Meeting {id}</h1>
      <p className="text-[#8a8a8a] mt-2">Phase 4 will build this out.</p>
    </div>
  );
}
