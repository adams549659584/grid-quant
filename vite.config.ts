import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path';
import ElementPlus from 'unplugin-element-plus/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import pkg from './package.json';
import { formatDate } from './build/utils';
import { initSvgIconsPlugin } from './build/vite/plugin/svgSprite';
import { VitePWA } from 'vite-plugin-pwa';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
};
// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  return {
    base: './', // 设置打包路径
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      }
    },
    server: {
      // host: '192.168.8.36',
      port: 4000, // 设置服务启动端口号
      open: true, // 设置服务启动时是否自动打开浏览器
      cors: true // 允许跨域
      // 设置代理，根据我们项目实际情况配置
      // proxy: {
      //   '/api': {
      //     target: 'http://xxx.xxx.xxx.xxx:8000',
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace('/api/', '/')
      //   }
      // }
    },
    // esbuild: {
    //   pure: ['console.log', 'debugger']
    // },
    // build:{
    //   target:'es2015',
    //   cssTarget:'chrome80'
    // },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    plugins: [
      vue(),
      ElementPlus({
        useSource: true
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      initSvgIconsPlugin(isBuild),
      VitePWA({
        includeAssets: ['./favicon.ico'],
        manifest: {
          name: '网格量化',
          short_name: '网格量化',
          // 加上图标就可以安装为 web app
          icons: [
            {
              src: './images/pwa/128.png',
              type: 'image/png',
              sizes: '128x128'
            },
            {
              src: './images/pwa/144.png',
              type: 'image/png',
              sizes: '144x144'
            },
            {
              src: './images/pwa/192.png',
              type: 'image/png',
              sizes: '192x192'
            },
            {
              src: './images/pwa/256.png',
              type: 'image/png',
              sizes: '256x256'
            },
            {
              src: './images/pwa/512.png',
              type: 'image/png',
              sizes: '512x512'
            }
          ]
        },
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            // {
            //   urlPattern: ({ request }) => request.url.toLowerCase().includes('/api/'),
            //   handler: 'NetworkFirst',
            //   options: {
            //     cacheName: `${name}-api-cache`
            //   }
            // },
            {
              urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
              handler: 'CacheFirst',
              options: {
                cacheName: `${name}-js-css-cache`
              }
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
              handler: 'CacheFirst',
              options: {
                cacheName: `${name}-image-cache`
              }
            }
          ]
        }
      })
    ]
    // build: {
    //   rollupOptions: {
    //     external: ['vue'],
    //     output: {
    //       globals: {
    //         vue: 'Vue'
    //       }
    //     }
    //   }
    // }
  };
};
