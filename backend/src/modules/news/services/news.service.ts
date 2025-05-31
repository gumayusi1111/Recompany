/**
 * 新闻服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const newsData = [
  { id: '1', name: '示例 - news', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - news', description: '第二条记录' }
];

/**
 * 获取所有新闻
 */
export const getAllNews = async () => {
  // 模拟数据库操作
  return [...newsData];
};

/**
 * 根据ID获取单个新闻
 */
export const getNewsById = async (id: string) => {
  // 模拟数据库操作
  return newsData.find(news => news.id === id);
};

/**
 * 创建新闻
 */
export const createNews = async (newsItem: any) => {
  // 模拟数据库操作
  const newNews = {
    id: String(newsData.length + 1),
    ...newsItem
  };
  newsData.push(newNews);
  return newNews;
};

/**
 * 更新新闻
 */
export const updateNews = async (id: string, newsItem: any) => {
  // 模拟数据库操作
  const index = newsData.findIndex(news => news.id === id);
  if (index === -1) return null;
  
  const updatedNews = {
    ...newsData[index],
    ...newsItem
  };
  newsData[index] = updatedNews;
  
  return updatedNews;
};

/**
 * 删除新闻
 */
export const deleteNews = async (id: string) => {
  // 模拟数据库操作
  const index = newsData.findIndex(news => news.id === id);
  if (index === -1) return false;
  
  newsData.splice(index, 1);
  return true;
};
