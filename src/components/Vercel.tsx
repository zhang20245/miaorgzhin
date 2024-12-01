import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Vercel() {
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
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 12L12 0 0 12h12v12h12V12z" fill="currentColor"/>
            </svg>
            部署到 Vercel
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. 准备工作</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>确保你有一个 GitHub、GitLab 或 Bitbucket 账号</li>
                <li>将项目代码推送到远程仓库</li>
                <li>注册一个 Vercel 账号 (<a href="https://vercel.com/signup" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">https://vercel.com/signup</a>)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. 导入项目</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>登录 Vercel 后，点击 "Add New Project"</li>
                <li>选择你要部署的 Git 仓库</li>
                <li>如果是首次使用，需要授权 Vercel 访问你的 Git 仓库</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. 配置部署设置</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>项目名称会自动填充，可以根据需要修改</li>
                <li>Framework Preset 会自动检测为 Vite</li>
                <li>Build Command 默认为 <code>npm run build</code></li>
                <li>Output Directory 默认为 <code>dist</code></li>
                <li>无需额外配置，Vercel 会自动识别项目类型</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. 部署项目</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>点击 "Deploy" 按钮开始部署</li>
                <li>Vercel 会自动进行构建和部署</li>
                <li>部署完成后，会获得一个 *.vercel.app 的域名</li>
                <li>每次推送代码到主分支，Vercel 都会自动重新部署</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. 额外功能</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>可以在项目设置中添加自定义域名</li>
                <li>支持自动生成预览部署（Preview Deployments）</li>
                <li>提供详细的部署日志和性能分析</li>
                <li>可以设置环境变量</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                提示：Vercel 为前端项目提供了最佳的部署体验，全程无需额外配置。每次提交代码后会自动部署，并提供预览环境和详细的性能分析。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}