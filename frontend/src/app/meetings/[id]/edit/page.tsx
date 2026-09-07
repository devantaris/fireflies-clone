import { EditMeetingClient } from "@/components/meetings/EditMeetingClient";

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditMeetingClient meetingId={Number(id)} />;
}
