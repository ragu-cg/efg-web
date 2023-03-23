const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL as string, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  const json = await res.json();
  console.log(json);
  if (json.errors) {
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getAllCoursesWithSlug() {
  const data = await fetchAPI(
    `
    query AllCoursessWithSlug {
      courses (first:100) {
        nodes {
          slug
          uri
        }
      }
    }
  `
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


export async function GetPostBySlug(slug:string) {
  const data = await fetchAPI(
    `
    query PostBySlug($uri: ID!) {
      course(id: $uri, idType: URI) {
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