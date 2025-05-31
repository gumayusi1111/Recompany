# 后端模块化重构指南

## 背景

为了提高代码质量和可维护性，我们正在将后端代码从扁平结构重构为模块化结构。Products模块已完成重构，作为其他模块重构的参考模板。

## 模块化结构说明

每个业务模块应遵循以下标准化目录结构：

```
modules/
└── [模块名]/
    ├── controllers/        # 处理HTTP请求和响应
    │   ├── [模块名].controller.ts   # 控制器实现
    │   └── index.ts        # 导出控制器
    ├── services/           # 业务逻辑实现
    │   ├── [模块名].service.ts      # 服务实现
    │   └── index.ts        # 导出服务
    ├── schemas/            # 数据验证模式
    │   ├── [模块名].schema.ts       # 模式定义
    │   └── index.ts        # 导出模式
    ├── routes/             # API路由定义
    │   ├── [模块名].routes.ts       # 路由实现
    │   └── index.ts        # 导出路由
    ├── types/              # TypeScript类型定义
    │   └── index.ts        # 导出类型
    └── index.ts            # 模块根导出文件
```

## 重构流程指南

按照以下步骤重构每个模块：

### 1. 创建模块化目录结构

为模块创建标准目录结构：

```bash
cd src/modules/[模块名]
mkdir -p controllers services schemas routes types
```

### 2. 创建控制器文件

```typescript
// controllers/[模块名].controller.ts
import { Request, Response } from 'express';
import * as service from '../services';

// 实现CRUD控制器方法
export const getAll = async (req: Request, res: Response) => {
  try {
    const items = await service.getAll();
    return res.status(200).json({ code: 200, msg: '获取成功', data: items });
  } catch (error) {
    return res.status(500).json({ code: 500, msg: '服务器错误', data: null });
  }
};

// 其它控制器方法...

// controllers/index.ts
export * from './[模块名].controller';
```

### 3. 创建服务层

```typescript
// services/[模块名].service.ts
// 实现业务逻辑方法
export const getAll = async () => {
  // 实际实现（数据库访问等）
  // 目前使用占位数据
  return [
    { id: '1', name: '示例项目1' },
    { id: '2', name: '示例项目2' },
  ];
};

// 其它服务方法...

// services/index.ts
export * from './[模块名].service';
```

### 4. 创建数据验证模式

```typescript
// schemas/[模块名].schema.ts
import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  // 其它字段...
});

// schemas/index.ts
export * from './[模块名].schema';
```

### 5. 创建路由

```typescript
// routes/[模块名].routes.ts
import express from 'express';
import { validateRequest } from '../../../middleware/validateRequest';
import * as controller from '../controllers';
import { CreateSchema, UpdateSchema } from '../schemas';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateRequest(CreateSchema), controller.create);
router.put('/:id', validateRequest(UpdateSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;

// routes/index.ts
import router from './[模块名].routes';
export default router;
```

### 6. 创建类型定义

```typescript
// types/index.ts
import { z } from 'zod';
import { ItemSchema } from '../schemas';

export type Item = z.infer<typeof ItemSchema>;
// 其它类型...
```

### 7. 创建模块入口

```typescript
// index.ts
import router from './routes';

// 导出控制器
export * from './controllers';

// 导出服务
export * from './services';

// 导出验证模式
export * from './schemas';

// 导出类型
export * from './types';

// 默认导出路由
export default router;
```

### 8. 更新主路由文件

在 `src/routes.ts` 中更新导入路径：

```typescript
// 使用新的模块化结构
import moduleName from './modules/[模块名]';
```

### 9. 删除旧的扁平结构文件

重构完成并测试通过后，删除旧的扁平结构文件：
- `controller.ts`
- `route.ts`
- `schema.ts`
- `service.ts`

## 注意事项

1. **TypeScript依赖**：如遇到模块导入错误，确保依赖已安装
   ```bash
   npm install
   ```

2. **Zod 验证**：使用 zod 进行数据验证，确保安装了正确的依赖
   ```bash
   npm install zod
   ```

3. **路径引用**：注意正确设置相对路径，特别是中间件引用

4. **API一致性**：保持统一的API响应格式，如：
   ```typescript
   {
     code: number,  // 状态码
     msg: string,   // 消息
     data: any      // 数据载荷
   }
   ```

5. **逐步迁移**：一次重构一个模块，确保其功能正常后再继续

## 已完成模块

- ✅ Products 模块

## 待重构模块

- ⬜ Materials
- ⬜ News
- ⬜ Projects
- ⬜ Testimonials
- ⬜ Home
- ⬜ About
- ⬜ Contact
