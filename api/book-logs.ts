import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HARDCOVER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "HARDCOVER_API_KEY not configured" });
  }

  const response = await fetch("https://api.hardcover.app/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `
        query BookLogs {
          me {
            lists(where: {name: {_in: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"]}}) {
              name
              list_books {
                book {
                  title
                  image {
                    url
                    color
                  }
                  contributions {
                    author {
                      name
                    }
                  }
                }
              }
            }
            user_books(where: { status_id: { _eq: 2 } }) {
              book {
                title
                image {
                  url
                  color
                }
                contributions {
                  author {
                    name
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  res.json(data);
}
