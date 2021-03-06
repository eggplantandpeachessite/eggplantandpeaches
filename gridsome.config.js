class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  siteName: 'Eggplant and Peaches',
  siteDescription: "A site for sharing my art, pictures and shenannigans.",
  siteUrl: 'https://festive-volhard-287716.netlify.com',
  titleTemplate: `%s | Eggplant and Peaches`,
  icon: 'src/favicon.png',

  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      plugins: [
        ['gridsome-plugin-remark-shiki', {
          theme: 'min-light'
        }]
      ]
    }
  },

  plugins: [{
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/posts/**/*.md',
        typeName: 'Post',
        route: '/:slug',
        refs: {
          tags: {
            typeName: 'Tag',
            route: '/tag/:id',
            create: true
          },
          author: {
            typeName: 'Author',
            route: '/author/:id',
            create: true
          }
        }
      }
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-11685135-3'
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        cacheTime: 600000, // default
      }
    },
    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'Post',
        feedOptions: {
          title: 'Eggplant and Peaches',
          feed_url: 'https://festive-volhard-287716.netlify.com/feed.xml',
          site_url: 'https://festive-volhard-287716.netlify.com'
        },
        feedItemOptions: node => ({
          title: node.title,
          description: node.description,
          url: 'https://festive-volhard-287716.netlify.com/' + node.slug,
          author: node.author,
          date: node.date
        }),
        output: {
          dir: './static',
          name: 'feed.xml'
        }
      }
    },
  ],

  chainWebpack: config => {
    config.module
      .rule('css')
      .oneOf('normal')
      .use('postcss-loader')
      .tap(options => {
        options.plugins.unshift(...[
          require('postcss-import'),
          require('postcss-nested'),
          require('tailwindcss'),
        ])

        if (process.env.NODE_ENV === 'production') {
          options.plugins.push(...[
            require('@fullhuman/postcss-purgecss')({
              content: [
                'src/assets/**/*.css',
                'src/**/*.vue',
                'src/**/*.js'
              ],
              extractors: [{
                extractor: TailwindExtractor,
                extensions: ['css', 'vue', 'js']
              }],
              whitelistPatterns: [/shiki/]
            }),
          ])
        }

        return options
      })
  },
}
