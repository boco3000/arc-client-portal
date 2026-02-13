import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { projects } from "@/data/projects";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return notFound();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <p className="text-sm text-neutral-400">{project.client}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="text-neutral-200">{project.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Due date</span>
            <span className="text-neutral-200">{project.dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Last updated</span>
            <span className="text-neutral-200">{project.updatedAt}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}