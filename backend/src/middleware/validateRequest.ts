import { Request, Response, NextFunction } from 'express';
// Zod已经内置TypeScript类型，不需要安装@types/zod
import { AnyZodObject, ZodError } from 'zod';

/**
 * 请求数据验证中间件
 * @param schema Zod验证模式
 */
export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // 验证请求体
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // 如果是验证错误，返回400错误
        res.status(400).json({ 
          code: 400, 
          msg: '输入数据验证失败', 
          data: { 
            errors: error.errors.map((e: any) => ({
              path: e.path.join('.'),
              message: e.message
            })) 
          } 
        });
        return;
      }
      // 其他错误返回500错误
      res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
    }
  };
};
