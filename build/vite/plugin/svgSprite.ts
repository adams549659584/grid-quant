/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/vbenjs/vite-plugin-svg-icons
 */
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export function initSvgIconsPlugin(isBuild: boolean) {
  // const svgIconsPlugin = SvgIconsPlugin({
  //   iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
  //   svgoOptions: isBuild,
  //   // default
  //   symbolId: 'icon-[dir]-[name]'
  // });
  const svgIconsPlugin = createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    /**
     * 自定义插入位置
     */
    inject: 'body-last',
    /**
     * custom dom id
     */
    customDomId: '__svg__icons__dom__'
  });
  return svgIconsPlugin;
}
