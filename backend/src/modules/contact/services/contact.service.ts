/**
 * 联系我们服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const contactData = [
  { id: '1', name: '示例 - contact', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - contact', description: '第二条记录' }
];

/**
 * 获取所有联系我们数据
 */
export const getAllContact = async () => {
  // 模拟数据库操作
  return [...contactData];
};

/**
 * 根据ID获取单个联系我们数据
 */
export const getContactById = async (id: string) => {
  // 模拟数据库操作
  return contactData.find(contact => contact.id === id);
};

/**
 * 创建新联系我们数据
 */
export const createContact = async (contactItemData: any) => {
  // 模拟数据库操作
  const newContact = {
    id: String(contactData.length + 1),
    ...contactItemData
  };
  contactData.push(newContact);
  return newContact;
};

/**
 * 更新联系我们数据
 */
export const updateContact = async (id: string, data: any) => {
  // 模拟数据库操作
  const index = contactData.findIndex(contact => contact.id === id);
  if (index === -1) return null;
  
  const updatedContact = {
    ...contactData[index],
    ...data
  };
  contactData[index] = updatedContact;
  
  return updatedContact;
};

/**
 * 删除联系我们数据
 */
export const deleteContact = async (id: string) => {
  // 模拟数据库操作
  const index = contactData.findIndex(contact => contact.id === id);
  if (index === -1) return false;
  
  contactData.splice(index, 1);
  return true;
};
