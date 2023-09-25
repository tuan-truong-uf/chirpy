import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import Image from "next/image";

const ProfileFeed = (props: {userId: string}) => {

  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId});

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted yet!</div>;

  return <div className="flex flex-col">
    {data.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id} />
    ))}
  </div>
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const {data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-36 bg-slate-600 relative">

          <Image 
            src={data.imageUrl} 
            alt={`${data.username ?? ""}'s profile pic`} 
            width={128}
            height={128}

            className="-mb-[64px] rounded-full border-4 border-black absolute bottom-0 left-0 ml-4 bg-black"
          />
        </div>
        < div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
        <ProfileFeed userId={data.id} />
        <div className="border-b border-slate-400 w-full" />
      </PageLayout>
    </>
  );
};


import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,  // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {

  return {paths: [], fallback: "blocking"};
};

export default ProfilePage;
