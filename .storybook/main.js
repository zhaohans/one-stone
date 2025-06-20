module.exports = {
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  stories: [
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/components/ui/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile', styles: { width: '375px', height: '667px' }
        },
        tablet: {
          name: 'Tablet', styles: { width: '768px', height: '1024px' }
        },
        desktop: {
          name: 'Desktop', styles: { width: '1440px', height: '900px' }
        },
      },
      defaultViewport: 'responsive',
    },
  },
}; 