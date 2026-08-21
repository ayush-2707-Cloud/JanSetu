import { MetadataRoute } from "next";
import { mockJourneys } from "@/data/mockJourneys";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = mockJourneys.map((j) => ({
    url: `${baseUrl}/journey/${j.journeyId}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
