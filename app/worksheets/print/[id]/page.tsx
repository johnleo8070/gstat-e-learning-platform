import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { PrintableWorksheet } from '@/components/worksheets/printable-worksheet'

async function getWorksheet(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('worksheets')
    .select('*, subject:subjects(name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

export default async function PrintWorksheetPage({ params }: { params: { id: string } }) {
  const worksheet = await getWorksheet(params.id)
  if (!worksheet) notFound()

  return <PrintableWorksheet worksheet={worksheet} />
}
