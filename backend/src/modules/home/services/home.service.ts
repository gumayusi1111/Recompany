/**
 * 首页服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const homeData = [
  { id: '1', name: '示例 - home', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - home', description: '第二条记录' }
];

/**
 * 获取所有首页数据
 */
export const getAllHome = async () => {
  // 模拟数据库操作
  return [...homeData];
};

/**
 * 根据ID获取单个首页数据
 */
export const getHomeById = async (id: string) => {
  // 模拟数据库操作
  return homeData.find(home => home.id === id);
};

/**
 * 创建新首页数据
 */
export const createHome = async (homeItemData: any) => {
  // 模拟数据库操作
  const newHome = {
    id: String(homeData.length + 1),
    ...homeItemData
  };
  homeData.push(newHome);
  return newHome;
};

/**
 * 更新首页数据
 */
export const updateHome = async (id: string, data: any) => {
  // 模拟数据库操作
  const index = homeData.findIndex(home => home.id === id);
  if (index === -1) return null;
  
  const updatedHome = {
    ...homeData[index],
    ...data
  };
  homeData[index] = updatedHome;
  
  return updatedHome;
};

/**
 * 删除首页数据
 */
export const deleteHome = async (id: string) => {
  // 模拟数据库操作
  const index = homeData.findIndex(home => home.id === id);
  if (index === -1) return false;
  
  homeData.splice(index, 1);
  return true;
};
