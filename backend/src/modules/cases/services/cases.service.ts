/**
 * 工程案例服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const casesData = [
  { id: '1', name: '示例 - cases', description: '这是一个工程案例占位数据' },
  { id: '2', name: '示例 2 - cases', description: '第二条工程案例记录' }
];

/**
 * 获取所有工程案例
 */
export const getAllProjects = async () => {
  // 模拟数据库操作
  return [...casesData];
};

/**
 * 根据ID获取单个工程案例
 */
export const getProjectById = async (id: string) => {
  // 模拟数据库操作
  return casesData.find(caseItem => caseItem.id === id);
};

/**
 * 创建新工程案例
 */
export const createProject = async (caseData: any) => {
  // 模拟数据库操作
  const newCase = {
    id: String(casesData.length + 1),
    ...caseData
  };
  casesData.push(newCase);
  return newCase;
};

/**
 * 更新工程案例
 */
export const updateProject = async (id: string, caseData: any) => {
  // 模拟数据库操作
  const index = casesData.findIndex(caseItem => caseItem.id === id);
  if (index === -1) return null;

  const updatedCase = {
    ...casesData[index],
    ...caseData
  };
  casesData[index] = updatedCase;

  return updatedCase;
};

/**
 * 删除工程案例
 */
export const deleteProject = async (id: string) => {
  // 模拟数据库操作
  const index = casesData.findIndex(caseItem => caseItem.id === id);
  if (index === -1) return false;

  casesData.splice(index, 1);
  return true;
};
