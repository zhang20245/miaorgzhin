import { ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Build() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回首页
        </Link>

        <div className="prose prose-blue">
          <h1 className="flex items-center gap-2 text-2xl font-bold mb-6">
            <Package className="w-8 h-8" />
            使用 npm run build 打包项目
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. 打包前的准备</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>确保所有代码已保存</li>
                <li>确保项目依赖已完整安装：
                  <pre className="bg-gray-50 p-2 rounded-lg mt-1">npm install</pre>
                </li>
                <li>检查 package.json 中的构建脚本配置是否正确</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. 执行打包命令</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm">npm run build</code>
              </div>
              <p className="mt-2">这个命令会：</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>运行 TypeScript 编译</li>
                <li>执行 Vite 的生产环境构建</li>
                <li>生成优化后的静态文件</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. 构建输出</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>打包后的文件会生成在 <code>dist</code> 目录下</li>
                <li>包含的文件通常有：
                  <ul className="list-disc pl-6 mt-2">
                    <li>index.html - 入口 HTML 文件</li>
                    <li>assets/ - 包含 JS、CSS 和其他静态资源</li>
                    <li>所有文件都经过压缩和优化</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. 预览构建结果</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>使用以下命令本地预览构建结果：
                  <pre className="bg-gray-50 p-2 rounded-lg mt-1">npm run preview</pre>
                </li>
                <li>这会启动一个本地服务器，通常在 http://localhost:4173</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. 常见问题解决</h2>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">构建失败</h3>
                  <ul className="list-disc pl-6 space-y-1 text-yellow-700">
                    <li>检查是否有 TypeScript 类型错误</li>
                    <li>确保所有依赖都正确安装</li>
                    <li>检查控制台错误信息</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">资源路径问题</h3>
                  <ul className="list-disc pl-6 space-y-1 text-blue-700">
                    <li>检查 vite.config.ts 中的 base 配置</li>
                    <li>确保资源引用路径正确</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">优化建议</h3>
                  <ul className="list-disc pl-6 space-y-1 text-green-700">
                    <li>使用 import 动态导入拆分代码</li>
                    <li>检查并移除未使用的依赖</li>
                    <li>优化图片和其他静态资源</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                提示：在部署到生产环境之前，建议始终在本地预览构建结果，确保一切正常。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}