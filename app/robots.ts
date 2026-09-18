import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/dashboard/",
                "/interview/",
                "/mock-interviews/",
                "/settings/",
                "/campus/dashboard/",
                "//dashboard/"
            ],
        },
        sitemap: "http://localhost:3000",
    };
}
