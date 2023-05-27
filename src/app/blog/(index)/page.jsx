import AppearanceEngineering from 'components/pages/blog/appearance-engineering';
import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import ReleaseNotesList from 'components/pages/blog/release-notes-list';
import VideoList from 'components/pages/blog/video-list';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { getWpBlogPage } from 'utils/api-posts';

export default async function BlogPage() {
  const releaseNotes = await fetch(
    `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/release-notes`
  ).then((res) => res.json());
  const featuredReleaseNotes = releaseNotes.slice(0, 4);
  const {
    featuredPosts,
    companyFeaturedPosts,
    communityFeaturedPosts,
    videos,
    appearances,
    engineeringFeaturedPosts,
  } = await getWpBlogPage();

  return (
    <>
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={communityFeaturedPosts} alignment="right" />
      <ReleaseNotesList items={featuredReleaseNotes} />
      <PostsList title="Company" posts={companyFeaturedPosts} alignment="left" />
      <VideoList videos={videos} />
      <SubscribeForm size="md" />
      <AppearanceEngineering
        appearancesPosts={appearances}
        engineeringPosts={engineeringFeaturedPosts}
      />
    </>
  );
}

export const revalidate = 60;
