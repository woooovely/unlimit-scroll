import { MutableRefObject, useRef } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { getPoke } from "@/pages/api";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

const Pokemon = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    "poke",
    ({ pageParam = "" }) => getPoke(pageParam),
    {
      getNextPageParam: (lastPage) => {
        const lastOffset =
          lastPage.results[lastPage.results.length - 1].url.split("/")[6];
        if (lastOffset > 1118) {
          return undefined;
        }
        return lastOffset;
      },
      staleTime: 1000,
    }
  );

  const loadMoreButtonRef = useRef<any>();

  useIntersectionObserver({
    root: null,
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  return (
    <>
      <ul>
        {data?.pages.map((page) =>
          page.results.map((poke: { name: string }) => (
            <li key={poke.name} style={{ padding: "20px", fontWeight: "bold" }}>
              {poke.name}
            </li>
          ))
        )}
      </ul>
      <div ref={loadMoreButtonRef} />
    </>
  );
};

export default Pokemon;