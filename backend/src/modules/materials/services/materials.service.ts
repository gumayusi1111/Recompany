/**
 * 材料服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const materialsData = [
  { id: '1', name: '示例 - materials', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - materials', description: '第二条记录' }
];

/**
 * 获取所有材料
 */
export const getAllMaterials = async () => {
  // 模拟数据库操作
  return [...materialsData];
};

/**
 * 根据ID获取单个材料
 */
export const getMaterialById = async (id: string) => {
  // 模拟数据库操作
  return materialsData.find(material => material.id === id);
};

/**
 * 创建新材料
 */
export const createMaterial = async (materialData: any) => {
  // 模拟数据库操作
  const newMaterial = {
    id: String(materialsData.length + 1),
    ...materialData
  };
  materialsData.push(newMaterial);
  return newMaterial;
};

/**
 * 更新材料
 */
export const updateMaterial = async (id: string, materialData: any) => {
  // 模拟数据库操作
  const index = materialsData.findIndex(material => material.id === id);
  if (index === -1) return null;
  
  const updatedMaterial = {
    ...materialsData[index],
    ...materialData
  };
  materialsData[index] = updatedMaterial;
  
  return updatedMaterial;
};

/**
 * 删除材料
 */
export const deleteMaterial = async (id: string) => {
  // 模拟数据库操作
  const index = materialsData.findIndex(material => material.id === id);
  if (index === -1) return false;
  
  materialsData.splice(index, 1);
  return true;
};
