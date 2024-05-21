const fs = require('fs');

const { glob } = require('glob');
const matter = require('gray-matter');

const GUIDES_DIR_PATH = 'content/guides';

const getPostSlugs = async (pathname) => {
  const files = await glob.sync(`${pathname}/**/*.md`, {
    ignore: [
      '**/RELEASE_NOTES_TEMPLATE.md',
      '**/README.md',
      '**/unused/**',
      '**/GUIDE_TEMPLATE.md',
    ],
  });
  return files.map((file) => file.replace(pathname, '').replace('.md', ''));
};

const getAuthor = (id) => {
  try {
    const authors = fs.readFileSync(
      `${process.cwd()}/${GUIDES_DIR_PATH}/authors/data.json`,
      'utf8'
    );
    const authorsData = JSON.parse(authors);
    const authorData = authorsData[id];
    const authorPhoto = `/guides/authors/${id}.jpg`;
    const author = {
      ...authorData,
      photo: authorPhoto,
    };

    if (author) {
      return author;
    }

    throw new Error(`Author with ID '${id}' not found.`);
  } catch (e) {
    return null;
  }
};

const getPostBySlug = (slug, pathname) => {
  try {
    const source = fs.readFileSync(`${process.cwd()}/${pathname}/${slug}.md`, 'utf-8');
    const { data, content } = matter(source);
    const authorID = data.author;
    const author = getAuthor(authorID);

    return { data, content, author };
  } catch (e) {
    return null;
  }
};

const getAllPosts = async () => {
  const slugs = await getPostSlugs(GUIDES_DIR_PATH);
  return slugs
    .map((slug) => {
      if (!getPostBySlug(slug, GUIDES_DIR_PATH)) return;
      const data = getPostBySlug(slug, GUIDES_DIR_PATH);

      const slugWithoutFirstSlash = slug.slice(1);
      const {
        data: { title, subtitle, createdAt, updatedOn, isDraft, redirectFrom },
        content,
        author,
      } = data;
      return {
        slug: slugWithoutFirstSlash,
        title,
        subtitle,
        author,
        createdAt,
        updatedOn,
        isDraft,
        content,
        redirectFrom,
      };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item.isDraft);
};

const getNavigationLinks = (slug, posts) => {
  const currentItemIndex = posts.findIndex((item) => item.slug === slug);

  // Determine the previous and next item indices, considering edges
  const previousItemIndex = currentItemIndex === 0 ? posts.length - 1 : currentItemIndex - 1;
  const nextItemIndex = currentItemIndex === posts.length - 1 ? 0 : currentItemIndex + 1;

  const previousItem = posts[previousItemIndex];
  const nextItem = posts[nextItemIndex];

  return {
    previousLink: { title: previousItem?.title, slug: previousItem?.slug },
    nextLink: { title: nextItem?.title, slug: nextItem?.slug },
  };
};

module.exports = {
  getPostSlugs,
  getPostBySlug,
  getNavigationLinks,
  getAllPosts,
  GUIDES_DIR_PATH,
};
