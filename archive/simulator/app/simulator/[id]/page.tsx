import { ScenarioDetailView } from '@/components/simulator/ScenarioDetailView'

interface ScenarioPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { id } = await params

  return <ScenarioDetailView scenarioId={id} />
}
