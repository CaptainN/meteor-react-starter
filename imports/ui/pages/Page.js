import { usePage } from '/imports/api/connectors/pages'

const Page = ({ slug }) => {
  const [pages, isLoading] = usePage({ slug })
  return <div dangerouslySetInnerHTML={{ __html: isLoading ? 'Loading' : pages[0].content }} />
}

export default Page
