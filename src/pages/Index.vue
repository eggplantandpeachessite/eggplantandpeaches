<template>
  <Layout class="bg-white">
    <main>
      <header>
        <div
          class="max-w-xl md:max-w-3xl xl:max-w-4xl mx-auto text-center px-6 py-10 md:py-32 border-b border-gray-300"
        >
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-sans font-bold mb-1">
            <g-link to="/" class="text-black">&#127814; and &#x1F351;</g-link>
          </h1>
          <p class="text-gray-700 text-lg sm:text-3xl">Art, pictures and shenannigans.</p>
        </div>
      </header>
      <section>
        <post-item v-for="edge in $page.posts.edges" :key="edge.node.id" :post="edge.node" />
      </section>
      <pagination :info="$page.posts.pageInfo" v-if="$page.posts.pageInfo.totalPages > 1" />
      <site-footer class="py-8 sm:py-16" />
    </main>
  </Layout>
</template>

<script>
import config from "~/.temp/config.js";
import SiteFooter from "@/components/Footer";
import PostItem from "@/components/PostItem";
import Pagination from "@/components/Pagination";

export default {
  components: {
    PostItem,
    Pagination,
    SiteFooter
  },
  metaInfo() {
    return {
      title: this.config.siteName,
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:title", content: this.config.siteName },
        { property: "og:description", content: this.config.siteDescription },
        { property: "og:url", content: this.config.siteUrl },
        { property: "og:image", content: this.ogImageUrl }
      ]
    };
  },
  computed: {
    config() {
      return config;
    },
    ogImageUrl() {
      return `${this.config.siteUrl}/images/bleda-card.png`;
    }
  }
};
</script>

<page-query>
  query Home ($page: Int) {
    posts: allPost (page: $page, perPage: 6) @paginate {
      totalCount
      pageInfo {
        totalPages
        currentPage
      }
      edges {
        node {
          id
          title
          datetime: date (format: "YYYY-MM-DD HH:mm:ss")
          content
          excerpt
          description
          path
          cover
          tags {
            id
            title
            path
          }
          author {
            id
            title
            path
          }
          featuredImage
        }
      }
    }
  }
</page-query>

