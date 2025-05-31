/**
 * 关于我们服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const aboutData = [
  { id: '1', name: '示例 - about', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - about', description: '第二条记录' }
];

/**
 * 获取所有关于我们数据
 */
export const getAllAbout = async () => {
  // 模拟数据库操作
  return [...aboutData];
};

/**
 * 根据ID获取单个关于我们数据
 */
export const getAboutById = async (id: string) => {
  // 模拟数据库操作
  return aboutData.find(about => about.id === id);
};

/**
 * 创建新关于我们数据
 */
export const createAbout = async (aboutItemData: any) => {
  // 模拟数据库操作
  const newAbout = {
    id: String(aboutData.length + 1),
    ...aboutItemData
  };
  aboutData.push(newAbout);
  return newAbout;
};

/**
 * 更新关于我们数据
 */
export const updateAbout = async (id: string, data: any) => {
  // 模拟数据库操作
  const index = aboutData.findIndex(about => about.id === id);
  if (index === -1) return null;
  
  const updatedAbout = {
    ...aboutData[index],
    ...data
  };
  aboutData[index] = updatedAbout;
  
  return updatedAbout;
};

/**
 * 删除关于我们数据
 */
export const deleteAbout = async (id: string) => {
  // 模拟数据库操作
  const index = aboutData.findIndex(about => about.id === id);
  if (index === -1) return false;
  
  aboutData.splice(index, 1);
  return true;
};
