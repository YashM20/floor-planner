export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="h-full">
      {children}
    </section>
  )
}
