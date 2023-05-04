import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from 'react-query'
import { FcNext, FcPrevious } from "react-icons/fc";

type NavInfo = {
  count: number
  pages: number
  next: string
  prev: string
}
const url = "https://rickandmortyapi.com/api/character/?page="

async function fetchPages(page = 1) {
  const res = await fetch(url + page)
  return res.json()
}

export const MyComp1 = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const { status, data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["rickandmorty", page],
    queryFn: () => fetchPages(page),
    keepPreviousData: true,
    staleTime: 5000,
  })

  useEffect(() => {
    if (data && data.info.next) {
      queryClient.prefetchQuery(['rickandmorty', page + 1], () => fetchPages(page + 1))
    }
  }, [data, isPreviousData, page, queryClient])


  const PageNavBar = (props: { info: NavInfo, page: number }) => {
    return (
      <div className="text-blue-600">
        <button
          disabled={props.info.prev == null}
          onClick={() => setPage(props.page > 1 ? props.page - 1 : 1)}
          className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <FcPrevious />
        </button>
        &nbsp;{page}&nbsp;
        <button
          disabled={props.info.next == null}
          onClick={() => setPage(props.page + 1)}
          className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <FcNext />
        </button>
      </div>
    )
  }

  if (error != null) return <p>Something Wrong</p>

  return (
    <div className="flex flex-col text-center text-white h-screen items-center">
      <div className="mb-1">
        <PageNavBar info={data ? (data.info) : ("")} page={page} />
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-4 gap-4">
          {data && data.results.filter((character: any) => character.gender == 'Male').map((v: any, k: any) => {
            return (
              <div
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:scale-110"
                key={k} >
                <a href={v.url}>
                  <img className="rounded-t-lg" src={v.image} />
                </a>
                <div>
                  <a href="#">
                    <span className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">{v.name}</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
