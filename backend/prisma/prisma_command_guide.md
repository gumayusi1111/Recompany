
# 📘 Prisma 使用命令说明（命令速查表）

Prisma 是一个现代化的数据库 ORM 工具，主要包括三个组件：
- `Prisma Client`: 用于查询数据库的 TypeScript 客户端
- `Prisma Migrate`: 数据库迁移系统
- `Prisma Studio`: 可视化数据库管理界面

---

## 🔧 1. 初始化 Prisma 项目

```bash
npx prisma init
```

**作用**：创建 Prisma 项目初始结构，包括：
- `prisma/schema.prisma`（模型定义文件）
- `.env`（环境变量配置文件）

---

## ✏️ 2. 编辑数据模型

编辑 `prisma/schema.prisma` 文件，定义 `model`，如：

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String?
  description String?
}
```

---

## 📦 3. 安装依赖（如尚未安装）

```bash
npm install prisma @prisma/client
```

---

## ⚙️ 4. 生成 Prisma Client（每次模型修改后都要执行）

```bash
npx prisma generate
```

**作用**：根据 `schema.prisma` 生成可在代码中调用的 Prisma Client（即 ORM 操作函数）。

---

## 🧱 5. 数据库迁移（推荐使用）

```bash
npx prisma migrate dev --name init
```

**适用场景**：
- 每次对 `schema.prisma` 做结构性修改时使用
- `--name` 是当前这次迁移的命名（如 `init`、`add-user-table` 等）
- 会创建 `migrations/` 目录并自动执行 `CREATE TABLE` 等 SQL 操作

---

## 🔍 6. 打开 Prisma Studio 可视化界面

```bash
npx prisma studio
```

**作用**：以网页形式浏览、编辑数据库中数据（开发阶段非常有用）。

---

## 📄 7. 查看当前数据库状态

```bash
npx prisma migrate status
```

**作用**：检查数据库是否与当前 `schema.prisma` 匹配。

---

## 📤 8. 手动推送 schema 到数据库（不创建迁移记录）

```bash
npx prisma db push
```

**适用场景**：
- 快速同步 `schema.prisma` 到数据库，但不会生成 migration 文件
- 一般用于原型开发阶段

---

## 🧪 9. 运行数据填充脚本（种子数据）

```bash
npx prisma db seed
```

需要先在 `package.json` 中添加：

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

再创建 `prisma/seed.ts`，写入数据插入逻辑。

---

## 🧠 什么时候用哪个命令？

| 场景 | 推荐命令 |
|------|----------|
| 初始化 Prisma 项目 | `npx prisma init` |
| 定义或修改模型后 | `npx prisma generate` |
| 正式结构修改建表 | `npx prisma migrate dev --name xxx` |
| 快速同步模型到数据库（不记录迁移） | `npx prisma db push` |
| 浏览数据库数据 | `npx prisma studio` |
| 插入初始数据 | `npx prisma db seed` |
| 检查数据库结构一致性 | `npx prisma migrate status` |
