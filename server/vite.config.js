import { defineConfig } from 'vite';
import { VitePluginNode } from '@roenlie/vite-plugin-node';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      exportName: 'irisServer',
      tsCompiler: 'swc',
    }),
  ],
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-swagger',
    ],
  },
});
