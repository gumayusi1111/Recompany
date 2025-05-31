/**
 * 项目服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const projectsData = [
  { id: '1', name: '示例 - projects', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - projects', description: '第二条记录' }
];

/**
 * 获取所有项目
 */
export const getAllProjects = async () => {
  // 模拟数据库操作
  return [...projectsData];
};

/**
 * 根据ID获取单个项目
 */
export const getProjectById = async (id: string) => {
  // 模拟数据库操作
  return projectsData.find(project => project.id === id);
};

/**
 * 创建新项目
 */
export const createProject = async (projectData: any) => {
  // 模拟数据库操作
  const newProject = {
    id: String(projectsData.length + 1),
    ...projectData
  };
  projectsData.push(newProject);
  return newProject;
};

/**
 * 更新项目
 */
export const updateProject = async (id: string, projectData: any) => {
  // 模拟数据库操作
  const index = projectsData.findIndex(project => project.id === id);
  if (index === -1) return null;
  
  const updatedProject = {
    ...projectsData[index],
    ...projectData
  };
  projectsData[index] = updatedProject;
  
  return updatedProject;
};

/**
 * 删除项目
 */
export const deleteProject = async (id: string) => {
  // 模拟数据库操作
  const index = projectsData.findIndex(project => project.id === id);
  if (index === -1) return false;
  
  projectsData.splice(index, 1);
  return true;
};
