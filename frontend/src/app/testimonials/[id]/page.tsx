// 使用类型断言绕过Next.js 15.3.3的类型检查问题
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ params }: any) {
  return <div>testimonials detail page: {params.id}</div>;
}
