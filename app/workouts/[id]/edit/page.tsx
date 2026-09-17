import { TemplateEditorScreen } from "@/components/template-editor-screen";

type EditWorkoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { id } = await params;
  return <TemplateEditorScreen templateId={id} />;
}
