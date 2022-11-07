import { GetServerSideProps } from "next";

import { Fragment, useEffect, useRef, useState } from "react";
import { getUsersData } from "../prisma/utils";
import { UserQuery } from "../types/user";
import UserCard from "../components/UserCard";
import LoadingUserCard from "../components/LoadingUserCard";

const LOAD_AMOUNT = 20;

type Props = {
  feed: UserQuery[];
};

export default function Home({ ...props }: Props) {
  const ref = useRef(null);
  const [feed, setFeed] = useState(props.feed);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState(LOAD_AMOUNT);

  const loadNext = async () => {
    if (!isLoading && cursor) {
      // When true this scope of logic won't run.
      setIsLoading(true);
      try {
        // Fetchs next data using cursor state.
        const response = await fetch(`/api/get-users?take=20&skip=${cursor}`);
        const { results, cursor: returnedCursor } = await response.json();
        // Updates feed rendered as usercards.
        setFeed([...feed, ...results]);
        // Updates the cursor with the position of last item.
        setCursor(returnedCursor);
      } finally {
        // When false allows loadNext main logic to run.
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Creates observer that runs loadNext.
    const observer = new IntersectionObserver(
      (bulk) =>
        bulk.forEach((entry) => {
          if (entry.isIntersecting) loadNext();
        }),
      { threshold: 1 }
    );
    // Registers observer.
    if (ref.current) observer.observe(ref.current);
    // Registers removal of obeserver...
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, feed]);

  return (
    <>
      <div className="block">
        {feed.map((item) => (
          <div key={item.fullName + item.color + item.id}>
            <UserCard {...item} />
          </div>
        ))}
      </div>

      <div key="loadingNextInterceptor" ref={ref}></div>

      {isLoading && (
        <>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <Fragment key={`loading ${index}`}>
                <LoadingUserCard />
              </Fragment>
            ))}
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await getUsersData(LOAD_AMOUNT);
  return {
    props: { feed },
  };
};
