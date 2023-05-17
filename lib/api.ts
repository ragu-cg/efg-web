import axios from "axios";
const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}?query=${query}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZWZnY21zOllDT2I1dUNvOEI3eGtiR1lvQ2szbktrUw=='
      }
    };

    const res = await axios.request(config);

    const json = await res.data;
    console.error('API Error', {
      url: {
        API_URL,
        graphql: {
          query,
          variables,
        },
      },
      errors: json.errors,
    });
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