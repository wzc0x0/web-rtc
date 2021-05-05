import { defineConfig } from 'umi';

export default defineConfig({
  title: 'File Transfer',
  hash: true,
  theme: {
    '@primary-color': '#ffa940',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  esbuild: {},
});
