import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { projects } from "@/data/projects";
import type { ProjectStatus } from "@/data/projects";
import { getProjectStatus } from "@/lib/projectStore";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { BackToProjectsButton } from "@/components/projects/BackToProjectsButton";
import { ProjectActivity } from "@/components/projects/ProjectActivity";
import { ProjectNotes } from "@/components/projects/ProjectNotes";
import { ProjectInvoices } from "@/components/projects/ProjectInvoices";
import { CreateInvoiceForm } from "@/components/projects/CreateInvoiceForm";
import { ProjectMetaEditor } from "@/components/projects/ProjectMetaEditor";
import { ProjectDetailsPanel } from "@/components/projects/ProjectDetailsPanel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const effectiveStatus = getProjectStatus(project.id, project.status);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <StatusBadge status={effectiveStatus} />
          </div>
          <p className="text-sm text-neutral-400">{project.client}</p>
        </div>

        <div className="flex items-center gap-2">
          <BackToProjectsButton />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-300">
              <div className="grid gap-2">
                <MetaRow label="Due date" value={project.dueDate} />
                <MetaRow label="Last updated" value={project.updatedAt} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectDetailsPanel
                projectId={project.id}
                initial={{
                  name: project.name,
                  client: project.client,
                  dueDate: project.dueDate,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectActivity projectId={project.id} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectNotes projectId={project.id} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectActions
                projectId={project.id}
                initialStatus={effectiveStatus}
              />
            </CardContent>
          </Card>

          <ProjectInvoices projectId={project.id} />

          <Card>
            <CardHeader>
              <CardTitle>Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateInvoiceForm
                projectId={project.id}
                client={project.client}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-200">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "active"
      ? "bg-white/10 text-white"
      : status === "review"
        ? "bg-white/5 text-neutral-100"
        : status === "paused"
          ? "bg-neutral-900 text-neutral-300"
          : status === "completed"
            ? "bg-neutral-950 text-neutral-400"
            : "bg-white/5 text-neutral-200";

  return (
    <span
      className={[
        "inline-flex items-center rounded-md border border-white/10 px-2 py-1 text-xs",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
