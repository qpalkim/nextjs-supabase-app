export default async function GroupCarpoolPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">카풀</h1>
      <p className="text-muted-foreground">준비 중입니다.</p>
    </div>
  );
}
