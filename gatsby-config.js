require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `cravePOS - Crave Restaurant Management Suite`,
    description: `cravePOS - Point-of-sale operations in Crave Restaurant Management Suite`,
    keywords: 'cravePOS, Crave, Point-of-sale, POS, Restaurant, Management, Suite, Bar, Food, Retail, Software, Neural, Smart, Business, Technology',
    siteUrl: 'https://www.neuralsmart.com/craveRMS',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'cravePOS - Crave Restaurant Management Suite',
        short_name: `cravePOS`,
        background_color: `#0f172a`,
        lang: `en`,
        theme_color: `#0f172a`,
        start_url: '/',
        display: `standalone`,
        cache_busting_mode: 'none',
        icon:'src/assets/icons/crave-icon-dark-bg.png',
        include_favicon: true,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-postcss`,
  ]
}
