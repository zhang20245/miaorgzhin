import { ArrowLeft, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Deploy() {
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
            <Github className="w-8 h-8" />
            部署到 GitHub Pages
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. 准备工作</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>确保你已经安装了 Git</li>
                <li>拥有一个 GitHub 账号</li>
                <li>本地项目代码已完成开发</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. 创建 GitHub 仓库</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>登录 GitHub，点击右上角 "+" 创建新仓库</li>
                <li>填写仓库名称（建议：meow-ai）</li>
                <li>选择公开（Public）仓库</li>
                <li>点击 "Create repository"</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. 推送代码到 GitHub</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <code className="text-sm">
                  # 初始化 Git 仓库<br />
                  git init<br /><br />
                  # 添加所有文件到暂存区<br />
                  git add .<br /><br />
                  # 提交更改<br />
                  git commit -m "Initial commit"<br /><br />
                  # 添加远程仓库<br />
                  git remote add origin https://github.com/你的用户名/仓库名.git<br /><br />
                  # 推送代码到主分支<br />
                  git push -u origin main
                </code>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. 配置 GitHub Pages</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>在项目的 package.json 中添加 "homepage" 字段：<br />
                  <code>"homepage": "https://你的用户名.github.io/仓库名"</code>
                </li>
                <li>安装 gh-pages 包：<br />
                  <code>npm install --save-dev gh-pages</code>
                </li>
                <li>在 package.json 的 "scripts" 中添加：<br />
                  <code>"predeploy": "npm run build",<br />
                  "deploy": "gh-pages -d dist"</code>
                </li>
                <li>运行部署命令：<br />
                  <code>npm run deploy</code>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. 完成部署</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>等待几分钟，访问 https://你的用户名.github.io/仓库名 即可看到部署的网站</li>
                <li>如果遇到问题，请检查：
                  <ul className="list-disc pl-6 mt-2">
                    <li>仓库设置中的 Pages 选项是否正确配置</li>
                    <li>确保构建命令执行成功</li>
                    <li>检查 homepage 路径是否正确</li>
                  </ul>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}