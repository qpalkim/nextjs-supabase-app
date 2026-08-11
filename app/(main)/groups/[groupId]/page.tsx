export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">공지·일정</h1>
      <p className="text-muted-foreground">준비 중입니다.</p>
    </div>
  );
}
