import FormExperience from "@/components/runtime/FormExperience";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FormExperience formId={id} />;
}
