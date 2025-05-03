import { ModelBrowser } from '@/components/browse/model-browser'

export default function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <main>
      <ModelBrowser />
    </main>
  )
}
