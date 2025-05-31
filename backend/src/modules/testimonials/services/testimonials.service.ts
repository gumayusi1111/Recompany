/**
 * 证言服务层实现
 * 目前使用占位数据，未来会替换为真实数据库操作
 */

// 占位数据
const testimonialsData = [
  { id: '1', name: '示例 - testimonials', description: '这是一个占位数据' },
  { id: '2', name: '示例 2 - testimonials', description: '第二条记录' }
];

/**
 * 获取所有证言
 */
export const getAllTestimonials = async () => {
  // 模拟数据库操作
  return [...testimonialsData];
};

/**
 * 根据ID获取单个证言
 */
export const getTestimonialById = async (id: string) => {
  // 模拟数据库操作
  return testimonialsData.find(testimonial => testimonial.id === id);
};

/**
 * 创建新证言
 */
export const createTestimonial = async (testimonialData: any) => {
  // 模拟数据库操作
  const newTestimonial = {
    id: String(testimonialsData.length + 1),
    ...testimonialData
  };
  testimonialsData.push(newTestimonial);
  return newTestimonial;
};

/**
 * 更新证言
 */
export const updateTestimonial = async (id: string, testimonialData: any) => {
  // 模拟数据库操作
  const index = testimonialsData.findIndex(testimonial => testimonial.id === id);
  if (index === -1) return null;
  
  const updatedTestimonial = {
    ...testimonialsData[index],
    ...testimonialData
  };
  testimonialsData[index] = updatedTestimonial;
  
  return updatedTestimonial;
};

/**
 * 删除证言
 */
export const deleteTestimonial = async (id: string) => {
  // 模拟数据库操作
  const index = testimonialsData.findIndex(testimonial => testimonial.id === id);
  if (index === -1) return false;
  
  testimonialsData.splice(index, 1);
  return true;
};
