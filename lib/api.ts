import axios from "axios";
const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  try {
    const res = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        query,
        variables
      })
    });

    const json = res.data;
    if (json.errors) {
      console.log(`url`, {
        API_URL,
        graphql: {
          query,
          variables,
        },
      });

      console.error(json.errors);
      throw new Error("Failed to fetch API");
    }
    return json.data;
  } catch (e) {
    console.error("api error", { e });
    throw e;
  }
}

export async function getAllCoursesWithSlug() {
  const data = await fetchAPI(
    `query AllCoursesWithSlug {
      courses(first: 100) {
        nodes {
          slug
          uri
        }
      }
    }`
  );
  return data?.courses;
}

export async function getAllPosts() {
  const data = await fetchAPI(
    `
    query AllPosts {
      courses (first:100)  {
        nodes {
          title
          slug
          databaseId
          link
          uri
          featuredImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `
  );
  return data?.courses;
}


export async function getFeaturedPosts() {
  const data = await fetchAPI(
    `
    query getFeaturedPosts {
      courseCategories(where: {name: "featured"}) {
        nodes {
          courses {
            nodes {
              title
              slug
              link
              uri
              featuredImage {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
    }
  `
  );
  console.log(data);
  return data?.courseCategories.nodes[0];
}


export async function GetPostBySlug(slug: string) {
  const data = await fetchAPI(
    `
    query PostBySlug($uri: ID!) {
      course(id: $uri, idType: SLUG) {
        title
        slug
        databaseId
        link
        content
        uri
        efgCourseFee
        efgCourseDuration
        efgCourseLanguage
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
    }
  `,
    {
      variables: {
        uri: slug
      }
    }
  );

  return data?.course;
}
